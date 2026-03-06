import { NextRequest, NextResponse } from 'next/server'
import { withAuth } from '@/lib/middleware/auth-guard'
import { getSessionStatus } from '@/lib/services/submission-service'

// GET /api/arena/[sessionId]/status — Server-authoritative time & progress
export const GET = withAuth(async (req: NextRequest, { userId, params }) => {
    const sessionId = params?.sessionId
    if (!sessionId) {
        return NextResponse.json({ error: true, code: 'VALIDATION_ERROR', message: 'sessionId is required' }, { status: 400 })
    }

    const result = await getSessionStatus(userId, sessionId)

    if ('error' in result && result.error) {
        const statusMap: Record<string, number> = {
            NOT_FOUND: 404,
            FORBIDDEN: 403,
        }
        return NextResponse.json(result, { status: statusMap[result.code as string] || 400 })
    }

    return NextResponse.json(result)
}, ['STUDENT'])
