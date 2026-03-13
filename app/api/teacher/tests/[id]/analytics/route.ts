import { NextRequest, NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'
import { withAuth } from '@/lib/middleware/auth-guard'
import { getTestAnalytics } from '@/lib/services/analytics-service'
import { prisma } from '@/lib/prisma'
import { Role } from '@prisma/client'

// GET /api/teacher/tests/[id]/analytics — get test analytics
async function getHandler(
    req: NextRequest,
    ctx: { userId: string; role: Role; params?: Record<string, string> }
) {
    const testId = ctx.params?.id
    if (!testId) return NextResponse.json({ error: true, code: 'BAD_REQUEST', message: 'Test ID required' }, { status: 400 })

    // Ownership check: teachers can only view their own tests' analytics
    if (ctx.role === 'TEACHER') {
        const test = await prisma.test.findUnique({
            where: { id: testId },
            select: { teacherId: true },
        })
        if (!test) return NextResponse.json({ error: true, code: 'NOT_FOUND', message: 'Test not found' }, { status: 404 })
        if (test.teacherId !== ctx.userId) {
            return NextResponse.json({ error: true, code: 'FORBIDDEN', message: 'You do not own this test' }, { status: 403 })
        }
    }

    const result = await getTestAnalytics(testId)
    if ('error' in result) return NextResponse.json(result, { status: 404 })
    return NextResponse.json(result)
}

export const GET = withAuth(getHandler, ['TEACHER', 'ADMIN'])

