import { expect, test, vi } from 'vitest'

vi.stubEnv('NODE_ENV', process.env.NODE_ENV ?? 'test')
vi.stubEnv('DATABASE_URL', process.env.DATABASE_URL ?? 'postgresql://tester:tester@localhost:5432/unimonk_test')
vi.stubEnv('DIRECT_URL', process.env.DIRECT_URL ?? process.env.DATABASE_URL ?? 'postgresql://tester:tester@localhost:5432/unimonk_test')

const aiServicePromise = import('../../../lib/services/ai-service')

const physicsPdfLikeMcqText = `
CUET PHYSICS — Chapter 1:
Electric Charges and Fields

Q1. Which of the following is the SI unit of electric charge?
(A) Ampere
(B) Volt
(C) Coulomb
(D) Farad
Answer: (C)
Explanation: The SI unit of electric charge is the coulomb (C).
Di culty: Easy

ffi

Q2. When a glass rod is rubbed with silk cloth, the rod acquires positive charge because:
(A) Protons are transferred from silk to glass
(B) Electrons are transferred from glass to silk
(C) Electrons are created on silk
(D) Protons are created on glass
Answer: (B)
Explanation: During rubbing, electrons are transferred from the glass rod to the silk cloth.
Di culty: Easy

Q3. The value of the elementary charge e is:
(A) 1.6 × 10⁻¹⁹ C
(B) 1.6 × 10⁻²⁰ C
(C) 1.6 × 10⁻¹⁸ C
(D) 9.1 × 10⁻³¹ C
Answer: (A)
Explanation: The basic unit of charge e = 1.6 × 10⁻¹⁹ C.
Di culty: Easy

Q4. A body has a charge of –3.2 × 10⁻¹⁸ C. The number of excess electrons on this body is:
(A) 10
(B) 20
(C) 30
(D) 40
Answer: (B)
Explanation: n = q/e = 20 electrons.
Di culty: Easy

Q5. Which of the following is NOT a property of electric charge?
(A) Additivity
(B) Conservation
(C) Quantisation
(D) Vectorisation
Answer: (D)
Explanation: Charge is a scalar quantity.
Di culty: Easy
`

test('extractQuestionsFromDocumentText parses PDF-like CUET MCQs with parenthesized answers and pdf artifacts', async () => {
    const {
        extractQuestionsFromDocumentText,
    } = await aiServicePromise

    const analysis = extractQuestionsFromDocumentText(physicsPdfLikeMcqText)

    expect(analysis.detectedAsMcqDocument).toBe(true)
    expect(analysis.questions).toHaveLength(5)
    expect(analysis.answerHintCount).toBeGreaterThanOrEqual(5)
    expect(analysis.questions[0]).toMatchObject({
        stem: 'Which of the following is the SI unit of electric charge?',
        difficulty: 'EASY',
    })
    expect(analysis.questions[0]?.options.find((option) => option.isCorrect)?.id).toBe('C')
})
