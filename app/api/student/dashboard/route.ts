import { NextRequest, NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'
import { withAuth } from '@/lib/middleware/auth-guard'
import { getDashboard } from '@/lib/services/student-service'
import { Role } from '@prisma/client'

async function getHandler(req: NextRequest, ctx: { userId: string; role: Role }) {
    const result = await getDashboard(ctx.userId)
    return NextResponse.json(result)
}

export const GET = withAuth(getHandler, ['STUDENT'])
