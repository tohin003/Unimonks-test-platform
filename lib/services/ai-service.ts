import OpenAI from 'openai'
import { Prisma } from '@prisma/client'

/**
 * AI Service — OpenAI integration for:
 * 1. Personalized post-test feedback
 * 2. Document → MCQ extraction
 * 
 * Gracefully falls back if no API key is configured.
 */

const openai = process.env.OPENAI_API_KEY
    ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
    : null

interface AnswerEntry {
    questionId: string
    optionId: string | null
    answeredAt: string
}

interface QuestionData {
    id: string
    order: number
    stem: string
    options: unknown
    difficulty: string
    topic: string | null
    explanation: string | null
}

interface SessionData {
    id: string
    score: number | null
    totalMarks: number
    percentage: number | null
    answers: unknown
    tabSwitchCount: number
    startedAt: Date
    submittedAt: Date | null
}

interface FeedbackResult {
    strengths: Prisma.InputJsonValue
    weaknesses: Prisma.InputJsonValue
    actionPlan: Prisma.InputJsonValue
    questionExplanations: Prisma.InputJsonValue
    overallTag: string
}

// ── Generate Personalized Feedback ──
export async function generatePersonalizedFeedback(
    session: SessionData,
    questions: QuestionData[]
): Promise<FeedbackResult> {
    const answers = (session.answers as AnswerEntry[] | null) || []

    // Build question analysis
    const questionAnalysis = questions.map(q => {
        const answer = answers.find(a => a.questionId === q.id)
        const opts = q.options as unknown
        let correctId: string | null = null
        let correctText = ''
        let selectedText = ''

        if (Array.isArray(opts)) {
            const correct = (opts as Array<{ id: string; text: string; isCorrect: boolean }>).find(o => o.isCorrect)
            correctId = correct?.id || null
            correctText = correct?.text || 'Unknown'
            if (answer?.optionId) {
                const selected = (opts as Array<{ id: string; text: string }>).find(o => o.id === answer.optionId)
                selectedText = selected?.text || 'Unknown'
            }
        } else if (typeof opts === 'object' && opts !== null) {
            const obj = opts as Record<string, string>
            correctId = obj.correct || null
            correctText = correctId ? obj[correctId] || 'Unknown' : 'Unknown'
            if (answer?.optionId) {
                selectedText = obj[answer.optionId] || 'Unknown'
            }
        }

        const isCorrect = answer?.optionId === correctId
        return {
            question: q.stem.substring(0, 120),
            topic: q.topic || 'General',
            difficulty: q.difficulty,
            isCorrect,
            wasAnswered: !!answer?.optionId,
            studentAnswer: selectedText,
            correctAnswer: correctText,
        }
    })

    const wrongAnswers = questionAnalysis.filter(q => !q.isCorrect)
    const rightAnswers = questionAnalysis.filter(q => q.isCorrect)
    const unanswered = questionAnalysis.filter(q => !q.wasAnswered)
    const timeTaken = session.submittedAt
        ? Math.floor((session.submittedAt.getTime() - session.startedAt.getTime()) / 1000)
        : 0

    // If no OpenAI key, generate rule-based feedback
    if (!openai) {
        return generateRuleBasedFeedback(session, questionAnalysis, rightAnswers, wrongAnswers, unanswered, timeTaken)
    }

    // Build prompt for OpenAI
    const prompt = `You are an expert educational tutor. Analyze this student's test performance and provide personalized, encouraging feedback.

## Test Results
- Score: ${session.score}/${session.totalMarks} (${session.percentage?.toFixed(1)}%)
- Time taken: ${Math.floor(timeTaken / 60)}min ${timeTaken % 60}s
- Tab switches: ${session.tabSwitchCount}
- Unanswered: ${unanswered.length} questions

## Questions Analysis
${questionAnalysis.map((q, i) => `${i + 1}. [${q.difficulty}] ${q.question}
   Topic: ${q.topic}
   ${q.wasAnswered ? (q.isCorrect ? '✅ Correct' : `❌ Wrong (chose: "${q.studentAnswer}", correct: "${q.correctAnswer}")`) : '⏭ Skipped'}`).join('\n\n')}

## Instructions
Respond in JSON format:
{
  "strengths": ["2-3 specific strengths based on what they got right"],
  "weaknesses": ["2-3 areas where they need improvement based on wrong answers"],
  "actionPlan": ["3-4 actionable study recommendations"],
  "questionExplanations": {"questionIndex": "Brief explanation of why the correct answer is right"},
  "overallTag": "A short 3-5 word assessment label (e.g., 'Strong in Theory, Weak in Application')"
}

Focus especially on ${wrongAnswers.length > 0 ? 'the topics they got wrong' : 'maintaining their excellent performance'}. Be encouraging but honest.`

    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [{ role: 'user', content: prompt }],
            temperature: 0.7,
            max_tokens: 1500,
            response_format: { type: 'json_object' },
        })

        const content = response.choices[0]?.message?.content
        if (!content) throw new Error('Empty AI response')

        const parsed = JSON.parse(content)

        return {
            strengths: (parsed.strengths || []) as Prisma.InputJsonValue,
            weaknesses: (parsed.weaknesses || []) as Prisma.InputJsonValue,
            actionPlan: (parsed.actionPlan || []) as Prisma.InputJsonValue,
            questionExplanations: (parsed.questionExplanations || {}) as Prisma.InputJsonValue,
            overallTag: parsed.overallTag || 'Analysis Complete',
        }
    } catch (err) {
        console.error('[AI] OpenAI call failed, falling back to rule-based:', err)
        return generateRuleBasedFeedback(session, questionAnalysis, rightAnswers, wrongAnswers, unanswered, timeTaken)
    }
}

// ── Rule-Based Fallback ──
function generateRuleBasedFeedback(
    session: SessionData,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    allQuestions: any[],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    rightAnswers: any[],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    wrongAnswers: any[],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    unanswered: any[],
    timeTaken: number
): FeedbackResult {
    const pct = session.percentage || 0

    // Build strengths
    const strengths: string[] = []
    if (pct >= 80) strengths.push('Excellent overall understanding of the material')
    else if (pct >= 60) strengths.push('Good grasp of the core concepts')
    else if (pct >= 40) strengths.push('Showing foundational understanding')

    const correctTopics = [...new Set(rightAnswers.map(q => q.topic))]
    if (correctTopics.length > 0) {
        strengths.push(`Strong performance in: ${correctTopics.slice(0, 3).join(', ')}`)
    }
    if (unanswered.length === 0) strengths.push('Attempted all questions — good test-taking strategy')
    if (strengths.length === 0) strengths.push('Keep practicing — every attempt is a learning opportunity')

    // Build weaknesses
    const weaknesses: string[] = []
    const wrongTopics = [...new Set(wrongAnswers.map(q => q.topic))]
    if (wrongTopics.length > 0) {
        weaknesses.push(`Needs improvement in: ${wrongTopics.slice(0, 3).join(', ')}`)
    }
    if (unanswered.length > 0) weaknesses.push(`${unanswered.length} questions left unanswered`)
    const hardWrong = wrongAnswers.filter(q => q.difficulty === 'HARD')
    if (hardWrong.length > 0) weaknesses.push(`Struggled with ${hardWrong.length} hard-level questions`)
    if (weaknesses.length === 0) weaknesses.push('Minor areas for improvement — overall strong showing')

    // Build action plan
    const actionPlan: string[] = []
    if (wrongTopics.length > 0) {
        actionPlan.push(`Review and practice problems in: ${wrongTopics.slice(0, 3).join(', ')}`)
    }
    if (pct < 60) actionPlan.push('Focus on building strong foundations before attempting harder topics')
    if (unanswered.length > 2) actionPlan.push('Practice time management — try to attempt all questions even if unsure')
    actionPlan.push('Review the explanations for questions you got wrong')
    if (pct >= 80) actionPlan.push('Challenge yourself with harder topics to push beyond your current level')

    // Overall tag
    let overallTag = 'Analysis Complete'
    if (pct >= 90) overallTag = 'Outstanding Performance'
    else if (pct >= 75) overallTag = 'Strong Understanding'
    else if (pct >= 60) overallTag = 'Good but Room to Grow'
    else if (pct >= 40) overallTag = 'Building Foundations'
    else overallTag = 'Needs More Practice'

    // Question explanations for wrong ones
    const explanations: Record<string, string> = {}
    wrongAnswers.forEach((q, i) => {
        explanations[String(i)] = `The correct answer is "${q.correctAnswer}". Review the topic: ${q.topic}`
    })

    return {
        strengths: strengths as unknown as Prisma.InputJsonValue,
        weaknesses: weaknesses as unknown as Prisma.InputJsonValue,
        actionPlan: actionPlan as unknown as Prisma.InputJsonValue,
        questionExplanations: explanations as unknown as Prisma.InputJsonValue,
        overallTag,
    }
}

// ── Generate MCQs from Document Text ──
export async function generateQuestionsFromText(text: string, count: number = 10) {
    if (!openai) {
        return { error: true, message: 'OpenAI API key not configured. Please set OPENAI_API_KEY.' }
    }

    const prompt = `You are an expert test creator. Generate ${count} multiple-choice questions from the following educational content. Each question MUST have:
- A clear, unambiguous stem
- Exactly 4 options labeled A-D
- Exactly 1 correct answer
- A brief explanation of why the correct answer is right
- A difficulty rating (EASY/MEDIUM/HARD)
- A topic tag

Content:
${text.substring(0, 8000)}

Respond in JSON format:
{
  "questions": [
    {
      "stem": "question text",
      "options": [
        {"id": "A", "text": "option text", "isCorrect": false},
        {"id": "B", "text": "option text", "isCorrect": true},
        {"id": "C", "text": "option text", "isCorrect": false},
        {"id": "D", "text": "option text", "isCorrect": false}
      ],
      "explanation": "why B is correct",
      "difficulty": "MEDIUM",
      "topic": "topic name"
    }
  ]
}`

    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [{ role: 'user', content: prompt }],
            temperature: 0.3,
            max_tokens: 4000,
            response_format: { type: 'json_object' },
        })

        const content = response.choices[0]?.message?.content
        if (!content) throw new Error('Empty AI response')

        const parsed = JSON.parse(content)
        return { questions: parsed.questions || [] }
    } catch (err) {
        console.error('[AI] Question generation failed:', err)
        return { error: true, message: 'Failed to generate questions. Please try again.' }
    }
}
