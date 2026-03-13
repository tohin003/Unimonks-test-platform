import { NextRequest, NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'
import { withAuth } from '@/lib/middleware/auth-guard'
import { prisma } from '@/lib/prisma'
import { redis } from '@/lib/redis'
import { createSession, setAuthCookies } from '@/lib/session'
import { Role } from '@prisma/client'

// POST /api/admin/stop-impersonation — restore original admin session
async function postHandler(req: NextRequest, ctx: { userId: string; role: Role }) {
    let originalAdminId: string | null = null
    let originalRole: Role = 'ADMIN'

    // Strategy 1: Current user IS the admin — direct key lookup
    const forwardKey = `impersonation:${ctx.userId}`
    const forwardData = await redis.get(forwardKey)

    if (forwardData) {
        const parsed = JSON.parse(forwardData)
        originalAdminId = ctx.userId
        originalRole = (parsed.originalRole || 'ADMIN') as Role

        // Clean up both forward and reverse keys
        const pipeline = redis.pipeline()
        pipeline.del(forwardKey)
        if (parsed.impersonatedUserId) {
            pipeline.del(`impersonation-reverse:${parsed.impersonatedUserId}`)
        }
        await pipeline.exec()
    } else {
        // Strategy 2: Current user IS the impersonated user — reverse key lookup (O(1))
        const reverseKey = `impersonation-reverse:${ctx.userId}`
        const adminId = await redis.get(reverseKey)

        if (adminId) {
            const adminForwardKey = `impersonation:${adminId}`
            const adminData = await redis.get(adminForwardKey)

            if (adminData) {
                const parsed = JSON.parse(adminData)
                originalAdminId = adminId
                originalRole = (parsed.originalRole || 'ADMIN') as Role
            } else {
                originalAdminId = adminId
            }

            // Clean up both keys
            const pipeline = redis.pipeline()
            pipeline.del(reverseKey)
            pipeline.del(adminForwardKey)
            await pipeline.exec()
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
            metadata: JSON.parse(JSON.stringify({ impersonatedUserId: ctx.userId })),
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

// Any authenticated user can stop impersonation
// (they may be authenticated as the impersonated user)
export const POST = withAuth(postHandler)
