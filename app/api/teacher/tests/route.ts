import { NextRequest, NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'
import { withAuth } from '@/lib/middleware/auth-guard'
import { TestQuerySchema, CreateTestSchema } from '@/lib/validations/test.schema'
import { listTests, createTest } from '@/lib/services/test-service'
import { Role } from '@prisma/client'

// GET /api/teacher/tests — list own tests
async function getHandler(req: NextRequest, ctx: { userId: string; role: Role }) {
    const url = new URL(req.url)
    const parsed = TestQuerySchema.safeParse({
        status: url.searchParams.get('status') || undefined,
        page: url.searchParams.get('page') || undefined,
        limit: url.searchParams.get('limit') || undefined,
    })

    if (!parsed.success) {
        return NextResponse.json(
            { error: true, code: 'VALIDATION_ERROR', message: 'Invalid query params', details: parsed.error.issues },
            { status: 400 }
        )
    }

    const result = await listTests(ctx.userId, parsed.data)
    return NextResponse.json(result)
}

// POST /api/teacher/tests — create draft test
async function postHandler(req: NextRequest, ctx: { userId: string; role: Role }) {
    const body = await req.json()
    const parsed = CreateTestSchema.safeParse(body)

    if (!parsed.success) {
        return NextResponse.json(
            { error: true, code: 'VALIDATION_ERROR', message: 'Invalid input', details: parsed.error.issues },
            { status: 400 }
        )
    }

    const result = await createTest(ctx.userId, parsed.data)
    return NextResponse.json(result, { status: 201 })
}

export const GET = withAuth(getHandler, ['TEACHER'])
export const POST = withAuth(postHandler, ['TEACHER'])
