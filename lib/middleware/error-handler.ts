import { NextRequest, NextResponse } from 'next/server'

export class AppError extends Error {
    statusCode: number
    code: string

    constructor(message: string, statusCode = 500, code = 'INTERNAL_ERROR') {
        super(message)
        this.statusCode = statusCode
        this.code = code
        this.name = 'AppError'
    }
}

// 400 Bad Request
export class BadRequestError extends AppError {
    constructor(message: string) { super(message, 400, 'BAD_REQUEST') }
}

// 401 Unauthorized
export class UnauthorizedError extends AppError {
    constructor(message = 'Authentication required') { super(message, 401, 'UNAUTHORIZED') }
}

// 403 Forbidden
export class ForbiddenError extends AppError {
    constructor(message = 'Insufficient permissions') { super(message, 403, 'FORBIDDEN') }
}

// 404 Not Found
export class NotFoundError extends AppError {
    constructor(message: string) { super(message, 404, 'NOT_FOUND') }
}

// 409 Conflict
export class ConflictError extends AppError {
    constructor(message: string) { super(message, 409, 'CONFLICT') }
}

type Handler = (req: NextRequest, ...args: unknown[]) => Promise<NextResponse>

/**
 * Wraps a handler in a try/catch, converting thrown errors into structured JSON.
 */
export function withErrorHandler(handler: Handler): Handler {
    return async (req: NextRequest, ...args: unknown[]) => {
        try {
            return await handler(req, ...args)
        } catch (err) {
            if (err instanceof AppError) {
                return NextResponse.json(
                    { error: true, code: err.code, message: err.message },
                    { status: err.statusCode }
                )
            }

            // Unknown errors – log and return generic 500
            console.error(`[ERROR] ${req.method} ${req.nextUrl.pathname}:`, err)
            return NextResponse.json(
                { error: true, code: 'INTERNAL_ERROR', message: 'An unexpected error occurred' },
                { status: 500 }
            )
        }
    }
}
