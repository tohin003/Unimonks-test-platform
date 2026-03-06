import { NextRequest, NextResponse } from 'next/server'
import { Role } from '@prisma/client'
import { redis } from '@/lib/redis'
import {
    generateAccessToken,
    generateRefreshToken,
    verifyAccessToken,
    JWTPayload,
} from '@/lib/auth'

const SESSION_TTL = 24 * 60 * 60 // 24 hours in seconds

function refreshKey(token: string) {
    return `refresh:${token}`
}

// Create a new session: generate tokens, store refresh in Redis
export async function createSession(userId: string, role: Role) {
    const accessToken = generateAccessToken(userId, role)
    const refreshToken = generateRefreshToken()

    // Store mapping refresh:token → userId
    await redis.set(refreshKey(refreshToken), userId, 'EX', SESSION_TTL)

    return { accessToken, refreshToken }
}

// Rotate refresh token:  old → delete,  new pair → return
export async function refreshSession(
    oldRefreshToken: string
): Promise<{ accessToken: string; refreshToken: string; userId: string } | null> {
    const userId = await redis.get(refreshKey(oldRefreshToken))
    if (!userId) return null

    // Delete old token (one-time use)
    await redis.del(refreshKey(oldRefreshToken))

    // We need the role — re-derive from a short lookup (stored alongside userId)
    const roleKey = `role:${userId}`
    const role = (await redis.get(roleKey)) as Role | null
    if (!role) return null

    const accessToken = generateAccessToken(userId, role)
    const refreshToken = generateRefreshToken()
    await redis.set(refreshKey(refreshToken), userId, 'EX', SESSION_TTL)

    return { accessToken, refreshToken, userId }
}

// Store the role alongside so refresh doesn't need DB hit
export async function storeUserRole(userId: string, role: Role) {
    await redis.set(`role:${userId}`, role, 'EX', SESSION_TTL)
}

// Remove all refresh tokens for a user (used on logout)
export async function destroySession(userId: string) {
    // Scan all refresh:* keys and delete those whose value matches userId
    let cursor = '0'
    do {
        const [nextCursor, keys] = await redis.scan(cursor, 'MATCH', 'refresh:*', 'COUNT', 100)
        cursor = nextCursor
        for (const key of keys) {
            const val = await redis.get(key)
            if (val === userId) {
                await redis.del(key)
            }
        }
    } while (cursor !== '0')
}

export const destroyAllSessions = destroySession

// Set httpOnly cookies on a response
export function setAuthCookies(
    response: NextResponse,
    accessToken: string,
    refreshToken: string
): NextResponse {
    const isProduction = process.env.NODE_ENV === 'production'

    response.cookies.set('access_token', accessToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: 'strict',
        path: '/',
        maxAge: SESSION_TTL,
    })

    response.cookies.set('refresh_token', refreshToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: 'strict',
        path: '/api/auth/refresh',
        maxAge: SESSION_TTL,
    })

    return response
}

// Clear auth cookies
export function clearAuthCookies(response: NextResponse): NextResponse {
    response.cookies.set('access_token', '', { maxAge: 0, path: '/' })
    response.cookies.set('refresh_token', '', { maxAge: 0, path: '/api/auth/refresh' })
    return response
}

// Read and verify session from request cookies
export function getSessionFromRequest(request: NextRequest): JWTPayload | null {
    const token = request.cookies.get('access_token')?.value
    if (!token) return null
    return verifyAccessToken(token)
}
