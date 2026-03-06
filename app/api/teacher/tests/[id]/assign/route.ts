import { NextRequest, NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'
import { withAuth } from '@/lib/middleware/auth-guard'
import { AssignTestSchema } from '@/lib/validations/test.schema'
import { assignTest } from '@/lib/services/test-service'
import { Role } from '@prisma/client'

// POST /api/teacher/tests/[id]/assign — assign test to batches/students
async function postHandler(
    req: NextRequest,
    ctx: { userId: string; role: Role; params?: Record<string, string> }
) {
    const testId = ctx.params?.id
    if (!testId) return NextResponse.json({ error: true, code: 'BAD_REQUEST', message: 'Test ID required' }, { status: 400 })

    const body = await req.json()
    const parsed = AssignTestSchema.safeParse(body)
    if (!parsed.success) {
        return NextResponse.json(
            { error: true, code: 'VALIDATION_ERROR', message: 'Invalid input', details: parsed.error.issues },
            { status: 400 }
        )
    }

    const result = await assignTest(ctx.userId, testId, parsed.data)
    if ('error' in result) {
        const statusCode = result.code === 'FORBIDDEN' ? 403 : result.code === 'NOT_FOUND' ? 404 : 400
        return NextResponse.json(result, { status: statusCode })
    }
    return NextResponse.json(result, { status: 201 })
}

export const POST = withAuth(postHandler, ['TEACHER'])
