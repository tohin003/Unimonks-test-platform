import 'dotenv/config'

import { Prisma, PrismaClient } from '@prisma/client'

import {
    FREE_BATCH_CODE,
    FREE_BATCH_KIND,
    FREE_BATCH_NAME,
    STANDARD_BATCH_KIND,
} from '../lib/config/platform-policy'

const prisma = new PrismaClient()

const studentNames = [
    'Alice Patel',
    'Bob Kumar',
    'Charlie Singh',
    'Diana Sharma',
    'Ethan Verma',
    'Fiona Gupta',
    'George Reddy',
    'Hannah Nair',
    'Isaac Thomas',
    'Julia Das',
]

type SeedUserInput = {
    email: string
    name: string
    role: 'ADMIN' | 'TEACHER' | 'STUDENT'
    status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED'
}

type SeedBatchInput = {
    name: string
    code: string
    teacherId: string
    kind: 'FREE_SYSTEM' | 'STANDARD'
    status: 'ACTIVE' | 'UPCOMING' | 'COMPLETED'
}

type SeedTestInput = {
    teacherId: string
    createdById: string
    title: string
    description: string
    durationMinutes: number
    status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
    source: 'MANUAL' | 'AI_GENERATED'
    questions: Prisma.QuestionCreateWithoutTestInput[]
}

async function upsertUser(data: SeedUserInput) {
    return prisma.user.upsert({
        where: { email: data.email },
        update: {
            name: data.name,
            role: data.role,
            status: data.status,
        },
        create: data,
    })
}

async function upsertBatch(data: SeedBatchInput) {
    return prisma.batch.upsert({
        where: { code: data.code },
        update: {
            name: data.name,
            teacherId: data.teacherId,
            kind: data.kind,
            status: data.status,
        },
        create: data,
    })
}

async function ensureQuestions(testId: string, questions: Prisma.QuestionCreateWithoutTestInput[]) {
    const existingQuestionCount = await prisma.question.count({ where: { testId } })
    if (existingQuestionCount > 0) return

    await prisma.question.createMany({
        data: questions.map((question) => ({
            testId,
            order: question.order,
            stem: question.stem,
            options: question.options,
            explanation: question.explanation ?? null,
            difficulty: question.difficulty,
            topic: question.topic ?? null,
        })),
    })
}

async function upsertTest(data: SeedTestInput) {
    const existing = await prisma.test.findFirst({
        where: {
            teacherId: data.teacherId,
            title: data.title,
        },
        select: {
            id: true,
        },
    })

    if (existing) {
        await prisma.test.update({
            where: { id: existing.id },
            data: {
                createdById: data.createdById,
                description: data.description,
                durationMinutes: data.durationMinutes,
                status: data.status,
                source: data.source,
            },
        })

        await ensureQuestions(existing.id, data.questions)
        return prisma.test.findUniqueOrThrow({ where: { id: existing.id } })
    }

    return prisma.test.create({
        data: {
            teacherId: data.teacherId,
            createdById: data.createdById,
            title: data.title,
            description: data.description,
            durationMinutes: data.durationMinutes,
            status: data.status,
            source: data.source,
            questions: {
                create: data.questions,
            },
        },
    })
}

async function ensureBatchAssignment(testId: string, batchId: string) {
    const existing = await prisma.testAssignment.findFirst({
        where: { testId, batchId },
        select: { id: true },
    })

    if (existing) return existing

    return prisma.testAssignment.create({
        data: { testId, batchId },
    })
}

async function upsertAliceSession(testId: string, studentId: string) {
    const startedAt = new Date(Date.now() - 20 * 60 * 1000)
    const submittedAt = new Date(Date.now() - 5 * 60 * 1000)
    const serverDeadline = new Date(startedAt.getTime() + 30 * 60 * 1000)

    const existing = await prisma.testSession.findFirst({
        where: {
            testId,
            studentId,
            attemptNumber: 1,
        },
        select: { id: true },
    })

    if (existing) {
        return prisma.testSession.update({
            where: { id: existing.id },
            data: {
                status: 'SUBMITTED',
                startedAt,
                serverDeadline,
                submittedAt,
                answers: { 1: 'B', 2: 'B', 3: 'A' },
                tabSwitchCount: 1,
                score: 2,
                totalMarks: 3,
                percentage: 66.67,
                attemptNumber: 1,
            },
        })
    }

    return prisma.testSession.create({
        data: {
            testId,
            studentId,
            attemptNumber: 1,
            status: 'SUBMITTED',
            startedAt,
            serverDeadline,
            submittedAt,
            answers: { 1: 'B', 2: 'B', 3: 'A' },
            tabSwitchCount: 1,
            score: 2,
            totalMarks: 3,
            percentage: 66.67,
        },
    })
}

async function main() {
    console.log('🌱 Seeding database...')

    const admin = await upsertUser({
        email: 'tohin1400@gmail.com',
        name: 'Admin User',
        role: 'ADMIN',
        status: 'ACTIVE',
    })

    const teacher1 = await upsertUser({
        email: 'tohin14000@gmail.com',
        name: 'Sarah Johnson',
        role: 'TEACHER',
        status: 'ACTIVE',
    })

    const teacher2 = await upsertUser({
        email: 'michael@unimonk.com',
        name: 'Michael Chen',
        role: 'TEACHER',
        status: 'ACTIVE',
    })

    const students = new Map<string, { id: string }>()

    for (let index = 0; index < studentNames.length; index += 1) {
        const firstName = studentNames[index].split(' ')[0].toLowerCase()
        const email = index === 0 ? 'tohin14001@gmail.com' : `${firstName}@student.com`

        const student = await upsertUser({
            email,
            name: studentNames[index],
            role: 'STUDENT',
            status: 'ACTIVE',
        })

        students.set(studentNames[index], { id: student.id })
    }

    const freeBatch = await upsertBatch({
        name: FREE_BATCH_NAME,
        code: FREE_BATCH_CODE,
        teacherId: admin.id,
        kind: FREE_BATCH_KIND,
        status: 'ACTIVE',
    })

    const batch1 = await upsertBatch({
        name: 'NEET Batch A',
        code: 'BATCH-2025-A',
        teacherId: teacher1.id,
        kind: STANDARD_BATCH_KIND,
        status: 'ACTIVE',
    })

    const batch2 = await upsertBatch({
        name: 'NEET Batch B',
        code: 'BATCH-2025-B',
        teacherId: teacher2.id,
        kind: STANDARD_BATCH_KIND,
        status: 'ACTIVE',
    })

    await upsertBatch({
        name: 'JEE Batch C',
        code: 'BATCH-2025-C',
        teacherId: teacher1.id,
        kind: STANDARD_BATCH_KIND,
        status: 'UPCOMING',
    })

    const batchAStudents = ['Alice Patel', 'Bob Kumar', 'Charlie Singh', 'Diana Sharma', 'Ethan Verma']
    const batchBStudents = ['Fiona Gupta', 'George Reddy', 'Hannah Nair', 'Isaac Thomas', 'Julia Das']

    await prisma.batchStudent.createMany({
        data: batchAStudents
            .map((name) => students.get(name)?.id)
            .filter((studentId): studentId is string => Boolean(studentId))
            .map((studentId) => ({ batchId: batch1.id, studentId })),
        skipDuplicates: true,
    })

    await prisma.batchStudent.createMany({
        data: batchBStudents
            .map((name) => students.get(name)?.id)
            .filter((studentId): studentId is string => Boolean(studentId))
            .map((studentId) => ({ batchId: batch2.id, studentId })),
        skipDuplicates: true,
    })

    const test1 = await upsertTest({
        teacherId: teacher1.id,
        createdById: admin.id,
        title: 'Biology: Cell Structure',
        description: 'A comprehensive test covering cell organelles, membrane transport, and cell division.',
        durationMinutes: 30,
        status: 'PUBLISHED',
        source: 'MANUAL',
        questions: [
            {
                order: 1,
                stem: 'Which organelle is known as the "powerhouse" of the cell?',
                options: {
                    A: 'Ribosome',
                    B: 'Mitochondria',
                    C: 'Golgi apparatus',
                    D: 'Lysosome',
                    correct: 'B',
                },
                difficulty: 'EASY',
                topic: 'Cell Organelles',
            },
            {
                order: 2,
                stem: 'What is the primary function of the Rough Endoplasmic Reticulum?',
                options: {
                    A: 'Lipid synthesis',
                    B: 'Protein synthesis',
                    C: 'Energy production',
                    D: 'Waste disposal',
                    correct: 'B',
                },
                difficulty: 'MEDIUM',
                topic: 'Cell Organelles',
            },
            {
                order: 3,
                stem: 'During which phase of mitosis do chromosomes align at the metaphase plate?',
                options: {
                    A: 'Prophase',
                    B: 'Metaphase',
                    C: 'Anaphase',
                    D: 'Telophase',
                    correct: 'B',
                },
                difficulty: 'MEDIUM',
                topic: 'Cell Division',
            },
        ],
    })

    const test2 = await upsertTest({
        teacherId: teacher2.id,
        createdById: admin.id,
        title: 'Physics: Kinematics Basics',
        description: 'Test on motion, velocity, acceleration and equations of motion.',
        durationMinutes: 45,
        status: 'PUBLISHED',
        source: 'AI_GENERATED',
        questions: [
            {
                order: 1,
                stem: 'A body moving with uniform acceleration has a velocity of 12 m/s at t=0. After 5 s, its velocity is 20 m/s. The displacement during this interval is:',
                options: {
                    A: '60 m',
                    B: '80 m',
                    C: '100 m',
                    D: '120 m',
                    correct: 'B',
                },
                difficulty: 'HARD',
                topic: 'Equations of Motion',
            },
        ],
    })

    await ensureBatchAssignment(test1.id, batch1.id)
    await ensureBatchAssignment(test2.id, batch2.id)

    const alice = students.get('Alice Patel')
    if (alice) {
        const session = await upsertAliceSession(test1.id, alice.id)

        await prisma.aIFeedback.upsert({
            where: { testSessionId: session.id },
            update: {
                strengths: ['Good understanding of cell organelles', 'Correct identification of mitochondria function'],
                weaknesses: ['Confusion in mitosis phases'],
                actionPlan: ['Review cell division phases', 'Practice mitosis vs meiosis comparison'],
                questionExplanations: {
                    3: 'Chromosomes align at the metaphase plate during Metaphase, not Prophase.',
                },
                overallTag: 'Intermediate',
            },
            create: {
                testSessionId: session.id,
                strengths: ['Good understanding of cell organelles', 'Correct identification of mitochondria function'],
                weaknesses: ['Confusion in mitosis phases'],
                actionPlan: ['Review cell division phases', 'Practice mitosis vs meiosis comparison'],
                questionExplanations: {
                    3: 'Chromosomes align at the metaphase plate during Metaphase, not Prophase.',
                },
                overallTag: 'Intermediate',
            },
        })
    }

    console.log('✅ Seeding complete!')
    console.log('   Admin:    tohin1400@gmail.com')
    console.log('   Teacher:  tohin14000@gmail.com')
    console.log('   Teacher:  michael@unimonk.com')
    console.log('   Student:  tohin14001@gmail.com')
    console.log(`   Free:     ${freeBatch.code} (${freeBatch.name})`)
    console.log('   (All users login via email OTP — no passwords)')
}

main()
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
