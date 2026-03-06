import { NextRequest, NextResponse } from 'next/server'
import { withAuth } from '@/lib/middleware/auth-guard'
import { flagViolation } from '@/lib/services/submission-service'

// POST /api/arena/[sessionId]/flag — Anti-cheat violation flag
export const POST = withAuth(async (req: NextRequest, { userId, params }) => {
    const sessionId = params?.sessionId
    if (!sessionId) {
        return NextResponse.json({ error: true, code: 'VALIDATION_ERROR', message: 'sessionId is required' }, { status: 400 })
    }

    const body = await req.json()
    const { type } = body

    if (!type || !['TAB_SWITCH', 'RIGHT_CLICK', 'COPY_ATTEMPT'].includes(type)) {
        return NextResponse.json(
            { error: true, code: 'VALIDATION_ERROR', message: 'type must be TAB_SWITCH, RIGHT_CLICK, or COPY_ATTEMPT' },
            { status: 400 }
        )
    }

    const result = await flagViolation(userId, sessionId, type)

    if ('error' in result && result.error) {
        const statusMap: Record<string, number> = {
            NOT_FOUND: 404,
            FORBIDDEN: 403,
            SESSION_ENDED: 400,
        }
        return NextResponse.json(result, { status: statusMap[result.code as string] || 400 })
    }

    return NextResponse.json(result)
}, ['STUDENT'])
