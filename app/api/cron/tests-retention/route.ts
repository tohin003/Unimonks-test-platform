import { NextRequest, NextResponse } from 'next/server'
import { purgeExpiredFinishedTests } from '@/lib/services/test-lifecycle'

export const dynamic = 'force-dynamic'

function isAuthorizedCronRequest(req: NextRequest) {
    const authHeader = req.headers.get('authorization')
    const cronSecret = process.env.CRON_SECRET

    if (cronSecret && authHeader === `Bearer ${cronSecret}`) {
        return true
    }

    if (process.env.NODE_ENV !== 'production') {
        return true
    }

    const userAgent = req.headers.get('user-agent') || ''
    return userAgent.toLowerCase().startsWith('vercel-cron/')
}

export async function GET(req: NextRequest) {
    if (!isAuthorizedCronRequest(req)) {
        return NextResponse.json(
            { error: true, code: 'FORBIDDEN', message: 'Unauthorized cron request' },
            { status: 403 }
        )
    }

    const result = await purgeExpiredFinishedTests()

    return NextResponse.json({
        ok: true,
        deletedCount: result.deletedCount,
        deletedIds: result.deletedIds,
        deletedTitles: result.deletedTitles,
    })
}
