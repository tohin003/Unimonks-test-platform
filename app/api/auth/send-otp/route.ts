import { NextRequest, NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'
import { prisma } from '@/lib/prisma'
import { generateOTP, hashOTP } from '@/lib/auth'
import { sendOTPEmail } from '@/lib/services/email-service'
import { SendOTPSchema } from '@/lib/validations/auth.schema'
import { withErrorHandler } from '@/lib/middleware/error-handler'
import { sendOTPRateLimit } from '@/lib/middleware/rate-limiter'

const OTP_EXPIRY_MINUTES = 5

async function sendOTPHandler(req: NextRequest): Promise<NextResponse> {
    const body = await req.json()
    const parsed = SendOTPSchema.safeParse(body)

    if (!parsed.success) {
        return NextResponse.json(
            { error: true, code: 'VALIDATION_ERROR', message: 'Invalid input', details: parsed.error.issues },
            { status: 400 }
        )
    }

    const { email } = parsed.data

    const user = await prisma.user.findUnique({ where: { email } })

    // User not found — tell the frontend clearly
    if (!user) {
        return NextResponse.json(
            { error: true, code: 'USER_NOT_FOUND', message: 'This email is not registered. Please contact your administrator to get an account.' },
            { status: 404 }
        )
    }

    // User is inactive or suspended
    if (user.status === 'INACTIVE' || user.status === 'SUSPENDED') {
        return NextResponse.json(
            { error: true, code: 'ACCOUNT_DISABLED', message: 'Your account has been deactivated. Please contact your administrator.' },
            { status: 403 }
        )
    }

    // Generate and store hashed OTP
    const otp = generateOTP()
    const hashedOTP = hashOTP(otp)
    const expiry = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000)

    await prisma.user.update({
        where: { id: user.id },
        data: { otp: hashedOTP, otpExpiry: expiry },
    })

    // In development, log OTP to console for testing
    if (process.env.NODE_ENV !== 'production') {
        console.log(`\n🔐 [DEV] OTP for ${user.email}: ${otp}\n`)
    }

    // Await email + audit log to guarantee delivery on serverless (Vercel kills bg tasks)
    const ipAddress = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown'

    await Promise.allSettled([
        sendOTPEmail(user.email, otp).catch((err) =>
            console.error('[WARN] Failed to send OTP email:', err)
        ),
        prisma.auditLog.create({
            data: { userId: user.id, action: 'OTP_SENT', ipAddress },
        }).catch((err) =>
            console.error('[WARN] Failed to create audit log:', err)
        ),
    ])

    return NextResponse.json({ message: 'OTP has been sent to your email.' })
}

export const POST = sendOTPRateLimit(withErrorHandler(sendOTPHandler) as (req: NextRequest, ...args: unknown[]) => Promise<NextResponse>)
