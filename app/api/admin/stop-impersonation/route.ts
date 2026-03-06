import { NextRequest, NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'
import { withAuth } from '@/lib/middleware/auth-guard'
import { prisma } from '@/lib/prisma'
import { redis } from '@/lib/redis'
import { createSession, setAuthCookies } from '@/lib/session'
import { Role } from '@prisma/client'

// POST /api/admin/stop-impersonation — restore original admin session
async function postHandler(req: NextRequest, ctx: { userId: string; role: Role }) {
    // Find impersonation record
    const keys = await redis.keys('impersonation:*')

    let originalAdminId: string | null = null
    let originalRole: Role = 'ADMIN'

    for (const key of keys) {
        const data = await redis.get(key)
        if (data) {
            const parsed = JSON.parse(data)
            originalAdminId = parsed.originalUserId || key.replace('impersonation:', '')
            originalRole = (parsed.originalRole || 'ADMIN') as Role
            await redis.del(key)
            break
        }
    }

    if (!originalAdminId) {
        return NextResponse.json(
            { error: true, code: 'NOT_IMPERSONATING', message: 'No active impersonation session found' },
            { status: 400 }
        )
    }

    // Restore admin session
    const { accessToken, refreshToken } = await createSession(originalAdminId, originalRole)

    const admin = await prisma.user.findUnique({
        where: { id: originalAdminId },
        select: { id: true, name: true, email: true, role: true },
    })

    // Audit log
    await prisma.auditLog.create({
        data: {
            userId: originalAdminId,
            action: 'IMPERSONATE_END',
            metadata: { impersonatedUserId: ctx.userId },
            ipAddress: req.headers.get('x-forwarded-for') || 'unknown',
        },
    })

    const response = NextResponse.json({
        message: 'Impersonation ended',
        user: admin,
    })

    setAuthCookies(response, accessToken, refreshToken)
    return response
}

// Allow any authenticated user to stop impersonation
export const POST = withAuth(postHandler)
