import { Queue } from 'bullmq'
import { redis } from '@/lib/redis'

/**
 * Submission Queue — handles grading under high concurrency.
 * For simple test-taking (< 50 concurrent), grading is done synchronously in the submit API.
 * This queue is used when we need to handle 400+ concurrent submissions.
 */
export const submissionQueue = new Queue('test-submissions', {
    connection: redis,
    defaultJobOptions: {
        attempts: 3,
        backoff: {
            type: 'exponential',
            delay: 1000, // 1s, 4s, 16s
        },
        removeOnComplete: { count: 100 },
        removeOnFail: { count: 50 },
    },
})

/**
 * Add a submission job to the queue.
 */
export async function enqueueSubmission(sessionId: string, studentId: string) {
    return submissionQueue.add('grade-submission', { sessionId, studentId }, {
        priority: 1, // High priority
    })
}
