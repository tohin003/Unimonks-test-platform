import { NextRequest, NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'
import { prisma } from '@/lib/prisma'
import { verifyOTP } from '@/lib/auth'
import { createSession, setAuthCookies, storeUserRole } from '@/lib/session'
import { VerifyOTPSchema } from '@/lib/validations/auth.schema'
import { withErrorHandler } from '@/lib/middleware/error-handler'
import { verifyOTPRateLimit } from '@/lib/middleware/rate-limiter'

async function verifyOTPHandler(req: NextRequest): Promise<NextResponse> {
    const body = await req.json()
    const parsed = VerifyOTPSchema.safeParse(body)

    if (!parsed.success) {
        return NextResponse.json(
            { error: true, code: 'VALIDATION_ERROR', message: 'Invalid input', details: parsed.error.issues },
            { status: 400 }
        )
    }

    const { email, otp } = parsed.data

    // Find user by email
    const user = await prisma.user.findUnique({ where: { email } })

    // Generic error — no user enumeration
    if (!user || user.status !== 'ACTIVE') {
        return NextResponse.json(
            { error: true, code: 'INVALID_OTP', message: 'Invalid or expired OTP' },
            { status: 401 }
        )
    }

    // Check OTP exists and hasn't expired
    if (!user.otp || !user.otpExpiry || new Date() > user.otpExpiry) {
        return NextResponse.json(
            { error: true, code: 'INVALID_OTP', message: 'Invalid or expired OTP' },
            { status: 401 }
        )
    }

    // Verify OTP hash
    const isValid = verifyOTP(otp, user.otp)
    if (!isValid) {
        return NextResponse.json(
            { error: true, code: 'INVALID_OTP', message: 'Invalid or expired OTP' },
            { status: 401 }
        )
    }

    // Clear OTP fields (single-use)
    await prisma.user.update({
        where: { id: user.id },
        data: { otp: null, otpExpiry: null },
    })

    // Create 24hr session
    const { accessToken, refreshToken } = await createSession(user.id, user.role)
    await storeUserRole(user.id, user.role)

    // Audit log
    await prisma.auditLog.create({
        data: {
            userId: user.id,
            action: 'LOGIN',
            ipAddress: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown',
        },
    })

    const response = NextResponse.json({
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
        },
    })

    return setAuthCookies(response, accessToken, refreshToken)
}

export const POST = verifyOTPRateLimit(withErrorHandler(verifyOTPHandler) as (req: NextRequest, ...args: unknown[]) => Promise<NextResponse>)
