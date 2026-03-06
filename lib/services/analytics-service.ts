import { prisma } from '@/lib/prisma'
import { redis } from '@/lib/redis'

/**
 * Analytics service for admin overview and test-level analytics.
 */

// ── Admin Overview Stats ──
export async function getAdminOverview() {
    const [
        usersByRole,
        testsByStatus,
        totalSessions,
        avgResult,
    ] = await Promise.all([
        prisma.user.groupBy({
            by: ['role'],
            _count: true,
            where: { status: 'ACTIVE' },
        }),
        prisma.test.groupBy({
            by: ['status'],
            _count: true,
        }),
        prisma.testSession.count({
            where: { status: { in: ['SUBMITTED', 'TIMED_OUT', 'FORCE_SUBMITTED'] } },
        }),
        prisma.testSession.aggregate({
            _avg: { percentage: true },
            where: { status: { in: ['SUBMITTED', 'TIMED_OUT', 'FORCE_SUBMITTED'] } },
        }),
    ])

    // Active sessions from Redis (if any sessions are tracked)
    let activeSessions = 0
    try {
        const keys = await redis.keys('session:*')
        activeSessions = keys.length
    } catch {
        // Redis might not have session tracking keys
    }

    const userCounts: Record<string, number> = {}
    usersByRole.forEach((g) => { userCounts[g.role] = g._count })

    const testCounts: Record<string, number> = {}
    testsByStatus.forEach((g) => { testCounts[g.status] = g._count })

    return {
        users: {
            total: Object.values(userCounts).reduce((a, b) => a + b, 0),
            admin: userCounts.ADMIN || 0,
            teacher: userCounts.TEACHER || 0,
            student: userCounts.STUDENT || 0,
        },
        tests: {
            total: Object.values(testCounts).reduce((a, b) => a + b, 0),
            draft: testCounts.DRAFT || 0,
            published: testCounts.PUBLISHED || 0,
            archived: testCounts.ARCHIVED || 0,
        },
        sessions: {
            completed: totalSessions,
            active: activeSessions,
        },
        avgScore: Math.round((avgResult._avg.percentage ?? 0) * 100) / 100,
    }
}

// ── Test-Level Analytics (used by both admin and teacher) ──
export async function getTestAnalytics(testId: string) {
    const test = await prisma.test.findUnique({
        where: { id: testId },
        include: {
            questions: { orderBy: { order: 'asc' } },
            sessions: {
                where: { status: { in: ['SUBMITTED', 'TIMED_OUT', 'FORCE_SUBMITTED'] } },
                include: {
                    student: { select: { id: true, name: true, email: true } },
                },
                orderBy: { percentage: 'desc' },
            },
        },
    })

    if (!test) return { error: true, code: 'NOT_FOUND', message: 'Test not found' }

    const sessions = test.sessions
    const scores = sessions.map((s) => s.percentage ?? 0)

    // Score distribution (buckets: 0-20, 21-40, 41-60, 61-80, 81-100)
    const distribution = [0, 0, 0, 0, 0]
    scores.forEach((s) => {
        if (s <= 20) distribution[0]++
        else if (s <= 40) distribution[1]++
        else if (s <= 60) distribution[2]++
        else if (s <= 80) distribution[3]++
        else distribution[4]++
    })

    const avg = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0
    const sorted = [...scores].sort((a, b) => a - b)
    const median = sorted.length > 0
        ? sorted.length % 2 === 0
            ? (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2
            : sorted[Math.floor(sorted.length / 2)]
        : 0

    // Per-question stats
    const questionStats = test.questions.map((q) => {
        let correct = 0
        let total = 0
        const optionCounts: Record<string, number> = {}

        sessions.forEach((s) => {
            const answers = s.answers as Record<string, string> | null
            if (answers && answers[q.id]) {
                total++
                const opts = q.options as Array<{ id: string; isCorrect: boolean }>
                const correctOpt = opts.find((o) => o.isCorrect)
                if (correctOpt && answers[q.id] === correctOpt.id) correct++
                optionCounts[answers[q.id]] = (optionCounts[answers[q.id]] || 0) + 1
            }
        })

        return {
            questionId: q.id,
            order: q.order,
            stem: q.stem.substring(0, 80) + (q.stem.length > 80 ? '...' : ''),
            difficulty: q.difficulty,
            topic: q.topic,
            correctRate: total > 0 ? Math.round((correct / total) * 100) : 0,
            totalAttempts: total,
        }
    })

    return {
        overview: {
            totalAttempts: sessions.length,
            avgScore: Math.round(avg * 100) / 100,
            median: Math.round(median * 100) / 100,
            passRate: scores.length > 0
                ? Math.round((scores.filter((s) => s >= 40).length / scores.length) * 100)
                : 0,
            distribution: {
                '0-20': distribution[0],
                '21-40': distribution[1],
                '41-60': distribution[2],
                '61-80': distribution[3],
                '81-100': distribution[4],
            },
        },
        topStudents: sessions.slice(0, 5).map((s) => ({
            id: s.student.id,
            name: s.student.name,
            score: s.score,
            percentage: s.percentage,
        })),
        bottomStudents: sessions.slice(-5).reverse().map((s) => ({
            id: s.student.id,
            name: s.student.name,
            score: s.score,
            percentage: s.percentage,
        })),
        questionStats,
    }
}
