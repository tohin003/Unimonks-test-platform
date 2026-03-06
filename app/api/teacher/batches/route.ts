import { NextRequest, NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'
import { withAuth } from '@/lib/middleware/auth-guard'
import { Role } from '@prisma/client'
import { prisma } from '@/lib/prisma'

// GET /api/teacher/batches — list batches allocated to this teacher
async function getHandler(req: NextRequest, ctx: { userId: string; role: Role }) {
    const batches = await prisma.batch.findMany({
        where: { teacherId: ctx.userId },
        select: {
            id: true,
            name: true,
            code: true,
            status: true,
        },
        orderBy: { name: 'asc' }
    })

    return NextResponse.json({ batches })
}

export const GET = withAuth(getHandler, ['TEACHER'])
