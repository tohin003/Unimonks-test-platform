import { NextRequest, NextResponse } from 'next/server'
import { ZodSchema } from 'zod'

type HandlerWithBody<T> = (req: NextRequest, body: T) => Promise<NextResponse>

/**
 * Higher-Order Function that validates a request body against a Zod schema.
 * Returns 400 with details on validation errors.
 */
export function withValidation<T>(schema: ZodSchema<T>, handler: HandlerWithBody<T>) {
    return async (req: NextRequest) => {
        let body: unknown
        try {
            body = await req.json()
        } catch {
            return NextResponse.json(
                { error: true, code: 'INVALID_JSON', message: 'Request body must be valid JSON' },
                { status: 400 }
            )
        }

        const result = schema.safeParse(body)
        if (!result.success) {
            const details = result.error.issues.map((e) => ({
                field: e.path.join('.'),
                message: e.message,
            }))
            return NextResponse.json(
                { error: true, code: 'VALIDATION_ERROR', message: 'Invalid input', details },
                { status: 400 }
            )
        }

        return handler(req, result.data)
    }
}
