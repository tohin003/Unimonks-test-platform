import { Client } from '@upstash/qstash'

/**
 * Upstash QStash Client — serverless-friendly job queue.
 *
 * Instead of a persistent worker process, QStash sends HTTP POST
 * requests to our webhook endpoints. Works perfectly with Vercel serverless.
 *
 * Supports two modes:
 *
 * 1. LOCAL DEV — run `npx @upstash/qstash-cli@latest dev` on port 8080
 *    Set QSTASH_URL=http://localhost:8080 in .env
 *    No real token or signing keys needed.
 *
 * 2. PRODUCTION — use Upstash cloud
 *    Set QSTASH_TOKEN, QSTASH_CURRENT_SIGNING_KEY, QSTASH_NEXT_SIGNING_KEY
 */

const isLocalDev = !!process.env.QSTASH_URL

const qstashClient = new Client({
    ...(isLocalDev
        ? { baseUrl: process.env.QSTASH_URL!, token: 'dev' }
        : { token: process.env.QSTASH_TOKEN! }
    ),
})

function getBaseUrl(): string {
    return process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
}

/**
 * Enqueue an AI feedback generation job.
 *
 * - Dedup ID prevents double-enqueue if student clicks submit twice
 * - Failure callback routes dead letters to DLQ endpoint for alerting
 * - QStash retries 3× with exponential backoff on 5xx responses
 */
export async function enqueueAIFeedback(sessionId: string) {
    const baseUrl = getBaseUrl()
    return qstashClient.publishJSON({
        url: `${baseUrl}/api/webhooks/ai-feedback`,
        body: { sessionId },
        retries: 3,
        deduplicationId: `ai-feedback:${sessionId}`,
        failureCallback: `${baseUrl}/api/webhooks/qstash-dlq`,
    })
}

/**
 * Enqueue a force-submit job for an expired session.
 *
 * - Dedup ID prevents double force-submit for the same session
 * - Failure callback routes dead letters to DLQ endpoint
 */
export async function enqueueForceSubmit(sessionId: string, studentId: string) {
    const baseUrl = getBaseUrl()
    return qstashClient.publishJSON({
        url: `${baseUrl}/api/webhooks/force-submit`,
        body: { sessionId, studentId },
        retries: 3,
        deduplicationId: `force-submit:${sessionId}`,
        failureCallback: `${baseUrl}/api/webhooks/qstash-dlq`,
    })
}

export { qstashClient }
