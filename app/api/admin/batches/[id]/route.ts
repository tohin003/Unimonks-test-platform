import { NextRequest, NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'
import { withAuth } from '@/lib/middleware/auth-guard'
import { UpdateBatchSchema } from '@/lib/validations/batch.schema'
import { getBatch, updateBatch, deleteBatch } from '@/lib/services/batch-service'
import { prisma } from '@/lib/prisma'
import { Role } from '@prisma/client'

// GET /api/admin/batches/[id] — single batch detail
async function getHandler(
    req: NextRequest,
    ctx: { userId: string; role: Role; params?: Record<string, string> }
) {
    const id = ctx.params?.id
    if (!id) return NextResponse.json({ error: true, code: 'BAD_REQUEST', message: 'Batch ID required' }, { status: 400 })

    const result = await getBatch(id)
    if ('error' in result) return NextResponse.json(result, { status: 404 })
    return NextResponse.json(result)
}

// PATCH /api/admin/batches/[id] — update batch
async function patchHandler(
    req: NextRequest,
    ctx: { userId: string; role: Role; params?: Record<string, string> }
) {
    const id = ctx.params?.id
    if (!id) return NextResponse.json({ error: true, code: 'BAD_REQUEST', message: 'Batch ID required' }, { status: 400 })

    const body = await req.json()
    const parsed = UpdateBatchSchema.safeParse(body)
    if (!parsed.success) {
        return NextResponse.json(
            { error: true, code: 'VALIDATION_ERROR', message: 'Invalid input', details: parsed.error.issues },
            { status: 400 }
        )
    }

    const result = await updateBatch(id, parsed.data)
    if ('error' in result) {
        const statusCode = result.code === 'NOT_FOUND' ? 404 : result.code === 'DUPLICATE_CODE' ? 409 : 400
        return NextResponse.json(result, { status: statusCode })
    }
    return NextResponse.json(result)
}

// DELETE /api/admin/batches/[id]?permanent=true — delete batch
async function deleteHandler(
    req: NextRequest,
    ctx: { userId: string; role: Role; params?: Record<string, string> }
) {
    const id = ctx.params?.id
    if (!id) return NextResponse.json({ error: true, code: 'BAD_REQUEST', message: 'Batch ID required' }, { status: 400 })

    const url = new URL(req.url)
    const permanent = url.searchParams.get('permanent') === 'true'

    const result = await deleteBatch(id, permanent)
    if ('error' in result) return NextResponse.json(result, { status: 404 })

    await prisma.auditLog.create({
        data: {
            userId: ctx.userId,
            action: permanent ? 'BATCH_PERMANENTLY_DELETED' : 'BATCH_DISABLED',
            metadata: { batchId: id },
            ipAddress: req.headers.get('x-forwarded-for') || 'unknown',
        },
    })

    return NextResponse.json(result)
}

export const GET = withAuth(getHandler, ['ADMIN'])
export const PATCH = withAuth(patchHandler, ['ADMIN'])
export const DELETE = withAuth(deleteHandler, ['ADMIN'])
