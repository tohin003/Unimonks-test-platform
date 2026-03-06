import { NextRequest, NextResponse } from 'next/server'
import { redis } from '@/lib/redis'

/**
 * Redis sliding-window rate limiter HOF.
 * @param getKey - function that returns the rate limit key from the request (e.g. IP or userId)
 * @param maxRequests - max requests allowed in the window
 * @param windowSeconds - window duration in seconds
 * @param handler - the actual route handler
 */
export function withRateLimit(
    getKey: (req: NextRequest) => string,
    maxRequests: number,
    windowSeconds: number,
    handler: (req: NextRequest, ...args: unknown[]) => Promise<NextResponse>
) {
    return async (req: NextRequest, ...args: unknown[]) => {
        const key = `ratelimit:${getKey(req)}`
        const now = Date.now()
        const windowStart = now - windowSeconds * 1000

        // Remove old entries outside the current window
        await redis.zremrangebyscore(key, '-inf', windowStart)

        // Count requests in the current window
        const count = await redis.zcard(key)

        if (count >= maxRequests) {
            return NextResponse.json(
                {
                    error: true,
                    code: 'RATE_LIMITED',
                    message: `Too many requests. Try again in ${windowSeconds} seconds.`,
                },
                {
                    status: 429,
                    headers: {
                        'Retry-After': String(windowSeconds),
                        'X-RateLimit-Limit': String(maxRequests),
                        'X-RateLimit-Remaining': '0',
                    },
                }
            )
        }

        // Add current request timestamp
        await redis.zadd(key, now, `${now}-${Math.random()}`)
        await redis.expire(key, windowSeconds)

        return handler(req, ...args)
    }
}

// Send OTP — 3 requests per 60s per IP
export const sendOTPRateLimit = (handler: (req: NextRequest, ...args: unknown[]) => Promise<NextResponse>) =>
    withRateLimit(
        (req) => `otp:${req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown'}`,
        3,
        60,
        handler
    )

// Verify OTP — 5 attempts per 60s per IP
export const verifyOTPRateLimit = (handler: (req: NextRequest, ...args: unknown[]) => Promise<NextResponse>) =>
    withRateLimit(
        (req) => `verify:${req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown'}`,
        5,
        60,
        handler
    )

export const aiGenerateRateLimit = (userId: string) =>
    (handler: (req: NextRequest, ...args: unknown[]) => Promise<NextResponse>) =>
        withRateLimit(() => userId, 5, 3600, handler)
