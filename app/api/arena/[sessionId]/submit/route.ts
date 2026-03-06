import { NextRequest, NextResponse } from 'next/server'
import { withAuth } from '@/lib/middleware/auth-guard'
import { submitTest } from '@/lib/services/submission-service'

// POST /api/arena/[sessionId]/submit — Submit test & get instant grade
export const POST = withAuth(async (req: NextRequest, { userId, params }) => {
    const sessionId = params?.sessionId
    if (!sessionId) {
        return NextResponse.json({ error: true, code: 'VALIDATION_ERROR', message: 'sessionId is required' }, { status: 400 })
    }

    const result = await submitTest(userId, sessionId)

    if ('error' in result && result.error) {
        const statusMap: Record<string, number> = {
            NOT_FOUND: 404,
            FORBIDDEN: 403,
            ALREADY_SUBMITTED: 409,
            DEADLINE_PASSED: 410,
        }
        return NextResponse.json(result, { status: statusMap[result.code as string] || 400 })
    }

    // TODO: Enqueue AI feedback job via BullMQ (Phase 3)
    // await aiFeedbackQueue.add('generate-feedback', { sessionId })

    return NextResponse.json(result)
}, ['STUDENT'])
