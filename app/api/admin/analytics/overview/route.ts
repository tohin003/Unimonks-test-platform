import { NextRequest, NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'
import { withAuth } from '@/lib/middleware/auth-guard'
import { getAdminOverview } from '@/lib/services/analytics-service'
import { Role } from '@prisma/client'

async function getHandler(req: NextRequest, ctx: { userId: string; role: Role }) {
    const result = await getAdminOverview()
    return NextResponse.json(result)
}

export const GET = withAuth(getHandler, ['ADMIN'])
