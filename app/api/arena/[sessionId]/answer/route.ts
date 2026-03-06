import { NextRequest, NextResponse } from 'next/server'
import { withAuth } from '@/lib/middleware/auth-guard'
import { saveAnswer } from '@/lib/services/submission-service'

// POST /api/arena/[sessionId]/answer — Save an answer (auto-save)
export const POST = withAuth(async (req: NextRequest, { userId, params }) => {
    const sessionId = params?.sessionId
    if (!sessionId) {
        return NextResponse.json({ error: true, code: 'VALIDATION_ERROR', message: 'sessionId is required' }, { status: 400 })
    }

    const body = await req.json()
    const { questionId, optionId } = body

    if (!questionId) {
        return NextResponse.json({ error: true, code: 'VALIDATION_ERROR', message: 'questionId is required' }, { status: 400 })
    }

    const result = await saveAnswer(userId, sessionId, questionId, optionId ?? null)

    if ('error' in result && result.error) {
        const statusMap: Record<string, number> = {
            NOT_FOUND: 404,
            FORBIDDEN: 403,
            SESSION_ENDED: 400,
            DEADLINE_PASSED: 410,
        }
        return NextResponse.json(result, { status: statusMap[result.code as string] || 400 })
    }

    return NextResponse.json(result)
}, ['STUDENT'])
