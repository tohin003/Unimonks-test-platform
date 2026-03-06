import { NextRequest, NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'
import { withAuth } from '@/lib/middleware/auth-guard'
import { UpdateQuestionSchema } from '@/lib/validations/test.schema'
import { updateQuestion, deleteQuestion } from '@/lib/services/test-service'
import { Role } from '@prisma/client'

// PATCH /api/teacher/tests/[id]/questions/[qId] — update question
async function patchHandler(
    req: NextRequest,
    ctx: { userId: string; role: Role; params?: Record<string, string> }
) {
    const testId = ctx.params?.id
    const qId = ctx.params?.qId
    if (!testId || !qId) {
        return NextResponse.json({ error: true, code: 'BAD_REQUEST', message: 'Test ID and Question ID required' }, { status: 400 })
    }

    const body = await req.json()
    const parsed = UpdateQuestionSchema.safeParse(body)
    if (!parsed.success) {
        return NextResponse.json(
            { error: true, code: 'VALIDATION_ERROR', message: 'Invalid input', details: parsed.error.issues },
            { status: 400 }
        )
    }

    const result = await updateQuestion(ctx.userId, testId, qId, parsed.data)
    if ('error' in result) {
        const statusCode = result.code === 'FORBIDDEN' ? 403 : result.code === 'NOT_FOUND' ? 404 : 400
        return NextResponse.json(result, { status: statusCode })
    }
    return NextResponse.json(result)
}

// DELETE /api/teacher/tests/[id]/questions/[qId] — delete question
async function deleteHandler(
    req: NextRequest,
    ctx: { userId: string; role: Role; params?: Record<string, string> }
) {
    const testId = ctx.params?.id
    const qId = ctx.params?.qId
    if (!testId || !qId) {
        return NextResponse.json({ error: true, code: 'BAD_REQUEST', message: 'Test ID and Question ID required' }, { status: 400 })
    }

    const result = await deleteQuestion(ctx.userId, testId, qId)
    if ('error' in result) {
        const statusCode = result.code === 'FORBIDDEN' ? 403 : result.code === 'NOT_FOUND' ? 404 : 400
        return NextResponse.json(result, { status: statusCode })
    }
    return NextResponse.json(result)
}

export const PATCH = withAuth(patchHandler, ['TEACHER'])
export const DELETE = withAuth(deleteHandler, ['TEACHER'])
