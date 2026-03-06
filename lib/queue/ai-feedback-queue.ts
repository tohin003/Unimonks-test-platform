import { Queue } from 'bullmq'
import { redis } from '@/lib/redis'

/**
 * AI Feedback Queue — generates personalized post-test feedback via OpenAI.
 * Lower priority than submission queue. Concurrency limited to 3 to respect API rate limits.
 */
export const aiFeedbackQueue = new Queue('ai-feedback', {
    connection: redis,
    defaultJobOptions: {
        attempts: 3,
        backoff: {
            type: 'exponential',
            delay: 2000, // 2s, 8s, 32s
        },
        removeOnComplete: { count: 200 },
        removeOnFail: { count: 100 },
    },
})

/**
 * Enqueue an AI feedback generation job.
 */
export async function enqueueAIFeedback(sessionId: string) {
    return aiFeedbackQueue.add('generate-feedback', { sessionId }, {
        priority: 5, // Lower priority than submissions
    })
}
