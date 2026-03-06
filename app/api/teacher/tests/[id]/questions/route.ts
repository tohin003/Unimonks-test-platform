import { NextRequest, NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'
import { withAuth } from '@/lib/middleware/auth-guard'
import { CreateQuestionSchema } from '@/lib/validations/test.schema'
import { getQuestions, addQuestion } from '@/lib/services/test-service'
import { Role } from '@prisma/client'

// GET /api/teacher/tests/[id]/questions — list questions
async function getHandler(
    req: NextRequest,
    ctx: { userId: string; role: Role; params?: Record<string, string> }
) {
    const testId = ctx.params?.id
    if (!testId) return NextResponse.json({ error: true, code: 'BAD_REQUEST', message: 'Test ID required' }, { status: 400 })

    const result = await getQuestions(ctx.userId, testId)
    if ('error' in result) {
        const statusCode = result.code === 'FORBIDDEN' ? 403 : 404
        return NextResponse.json(result, { status: statusCode })
    }
    return NextResponse.json(result)
}

// POST /api/teacher/tests/[id]/questions — add question
async function postHandler(
    req: NextRequest,
    ctx: { userId: string; role: Role; params?: Record<string, string> }
) {
    const testId = ctx.params?.id
    if (!testId) return NextResponse.json({ error: true, code: 'BAD_REQUEST', message: 'Test ID required' }, { status: 400 })

    const body = await req.json()
    const parsed = CreateQuestionSchema.safeParse(body)
    if (!parsed.success) {
        return NextResponse.json(
            { error: true, code: 'VALIDATION_ERROR', message: 'Invalid input', details: parsed.error.issues },
            { status: 400 }
        )
    }

    const result = await addQuestion(ctx.userId, testId, parsed.data)
    if ('error' in result) {
        const statusCode = result.code === 'FORBIDDEN' ? 403 : result.code === 'NOT_FOUND' ? 404 : 400
        return NextResponse.json(result, { status: statusCode })
    }
    return NextResponse.json(result, { status: 201 })
}

export const GET = withAuth(getHandler, ['TEACHER'])
export const POST = withAuth(postHandler, ['TEACHER'])
