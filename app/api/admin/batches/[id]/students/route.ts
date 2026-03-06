import { NextRequest, NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'
import { withAuth } from '@/lib/middleware/auth-guard'
import { EnrollStudentsSchema } from '@/lib/validations/batch.schema'
import { enrollStudents, unenrollStudent } from '@/lib/services/batch-service'
import { Role } from '@prisma/client'

// POST /api/admin/batches/[id]/students — bulk enroll students
async function postHandler(
    req: NextRequest,
    ctx: { userId: string; role: Role; params?: Record<string, string> }
) {
    const batchId = ctx.params?.id
    if (!batchId) return NextResponse.json({ error: true, code: 'BAD_REQUEST', message: 'Batch ID required' }, { status: 400 })

    const body = await req.json()
    const parsed = EnrollStudentsSchema.safeParse(body)
    if (!parsed.success) {
        return NextResponse.json(
            { error: true, code: 'VALIDATION_ERROR', message: 'Invalid input', details: parsed.error.issues },
            { status: 400 }
        )
    }

    const result = await enrollStudents(batchId, parsed.data)
    if ('error' in result) {
        const statusCode = result.code === 'NOT_FOUND' ? 404 : 400
        return NextResponse.json(result, { status: statusCode })
    }
    return NextResponse.json(result, { status: 201 })
}

// DELETE /api/admin/batches/[id]/students?studentId=xxx — unenroll student
async function deleteHandler(
    req: NextRequest,
    ctx: { userId: string; role: Role; params?: Record<string, string> }
) {
    const batchId = ctx.params?.id
    if (!batchId) return NextResponse.json({ error: true, code: 'BAD_REQUEST', message: 'Batch ID required' }, { status: 400 })

    const url = new URL(req.url)
    const studentId = url.searchParams.get('studentId')
    if (!studentId) {
        return NextResponse.json({ error: true, code: 'BAD_REQUEST', message: 'studentId query param is required' }, { status: 400 })
    }

    const result = await unenrollStudent(batchId, studentId)
    if ('error' in result) return NextResponse.json(result, { status: 404 })
    return NextResponse.json(result)
}

export const POST = withAuth(postHandler, ['ADMIN'])
export const DELETE = withAuth(deleteHandler, ['ADMIN'])
