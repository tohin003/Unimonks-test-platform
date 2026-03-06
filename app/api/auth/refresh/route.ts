import { NextRequest, NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'
import { refreshSession, setAuthCookies } from '@/lib/session'
import { withErrorHandler } from '@/lib/middleware/error-handler'

async function refreshHandler(req: NextRequest): Promise<NextResponse> {
    const refreshToken = req.cookies.get('refresh_token')?.value

    if (!refreshToken) {
        return NextResponse.json(
            { error: true, code: 'UNAUTHORIZED', message: 'No refresh token' },
            { status: 401 }
        )
    }

    const result = await refreshSession(refreshToken)
    if (!result) {
        return NextResponse.json(
            { error: true, code: 'UNAUTHORIZED', message: 'Invalid or expired refresh token' },
            { status: 401 }
        )
    }

    const response = NextResponse.json({ message: 'Token refreshed' })
    return setAuthCookies(response, result.accessToken, result.refreshToken)
}

export const POST = withErrorHandler(refreshHandler)
