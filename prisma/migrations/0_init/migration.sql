CREATE SCHEMA IF NOT EXISTS "public";

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'Role') THEN
        CREATE TYPE "Role" AS ENUM ('ADMIN', 'TEACHER', 'STUDENT');
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'UserStatus') THEN
        CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'SUSPENDED');
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'BatchStatus') THEN
        CREATE TYPE "BatchStatus" AS ENUM ('ACTIVE', 'UPCOMING', 'COMPLETED');
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'TestStatus') THEN
        CREATE TYPE "TestStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'TestSource') THEN
        CREATE TYPE "TestSource" AS ENUM ('MANUAL', 'AI_GENERATED');
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'SessionStatus') THEN
        CREATE TYPE "SessionStatus" AS ENUM ('IN_PROGRESS', 'SUBMITTED', 'TIMED_OUT', 'FORCE_SUBMITTED');
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'Difficulty') THEN
        CREATE TYPE "Difficulty" AS ENUM ('EASY', 'MEDIUM', 'HARD');
    END IF;
END $$;

CREATE TABLE IF NOT EXISTS "User" (
    "id" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'STUDENT',
    "status" "UserStatus" NOT NULL DEFAULT 'ACTIVE',
    "otp" TEXT,
    "otpExpiry" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "Batch" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "teacherId" UUID NOT NULL,
    "status" "BatchStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Batch_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "BatchStudent" (
    "batchId" UUID NOT NULL,
    "studentId" UUID NOT NULL,

    CONSTRAINT "BatchStudent_pkey" PRIMARY KEY ("batchId", "studentId")
);

CREATE TABLE IF NOT EXISTS "Test" (
    "id" UUID NOT NULL,
    "teacherId" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "durationMinutes" INTEGER NOT NULL,
    "status" "TestStatus" NOT NULL DEFAULT 'DRAFT',
    "source" "TestSource" NOT NULL DEFAULT 'MANUAL',
    "settings" JSONB NOT NULL DEFAULT '{}',
    "scheduledAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Test_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "Question" (
    "id" UUID NOT NULL,
    "testId" UUID NOT NULL,
    "order" INTEGER NOT NULL,
    "stem" TEXT NOT NULL,
    "options" JSONB NOT NULL,
    "explanation" TEXT,
    "difficulty" "Difficulty" NOT NULL DEFAULT 'MEDIUM',
    "topic" TEXT,

    CONSTRAINT "Question_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "TestAssignment" (
    "id" UUID NOT NULL,
    "testId" UUID NOT NULL,
    "batchId" UUID,
    "studentId" UUID,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TestAssignment_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "TestSession" (
    "id" UUID NOT NULL,
    "testId" UUID NOT NULL,
    "studentId" UUID NOT NULL,
    "status" "SessionStatus" NOT NULL DEFAULT 'IN_PROGRESS',
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "serverDeadline" TIMESTAMP(3) NOT NULL,
    "submittedAt" TIMESTAMP(3),
    "answers" JSONB,
    "tabSwitchCount" INTEGER NOT NULL DEFAULT 0,
    "score" INTEGER,
    "totalMarks" INTEGER NOT NULL,
    "percentage" DOUBLE PRECISION,

    CONSTRAINT "TestSession_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "AIFeedback" (
    "id" UUID NOT NULL,
    "testSessionId" UUID NOT NULL,
    "strengths" JSONB NOT NULL,
    "weaknesses" JSONB NOT NULL,
    "actionPlan" JSONB NOT NULL,
    "questionExplanations" JSONB NOT NULL,
    "overallTag" TEXT,
    "generatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AIFeedback_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "AuditLog" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "action" TEXT NOT NULL,
    "metadata" JSONB,
    "ipAddress" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX IF NOT EXISTS "Batch_code_key" ON "Batch"("code");
CREATE INDEX IF NOT EXISTS "BatchStudent_studentId_idx" ON "BatchStudent"("studentId");
CREATE INDEX IF NOT EXISTS "Question_testId_order_idx" ON "Question"("testId", "order");
CREATE INDEX IF NOT EXISTS "TestAssignment_testId_batchId_idx" ON "TestAssignment"("testId", "batchId");
CREATE INDEX IF NOT EXISTS "TestAssignment_studentId_idx" ON "TestAssignment"("studentId");
CREATE INDEX IF NOT EXISTS "TestSession_testId_studentId_idx" ON "TestSession"("testId", "studentId");
CREATE INDEX IF NOT EXISTS "TestSession_studentId_status_idx" ON "TestSession"("studentId", "status");
CREATE UNIQUE INDEX IF NOT EXISTS "AIFeedback_testSessionId_key" ON "AIFeedback"("testSessionId");
CREATE INDEX IF NOT EXISTS "AuditLog_userId_createdAt_idx" ON "AuditLog"("userId", "createdAt");

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Batch_teacherId_fkey') THEN
        ALTER TABLE "Batch"
            ADD CONSTRAINT "Batch_teacherId_fkey"
            FOREIGN KEY ("teacherId") REFERENCES "User"("id")
            ON DELETE RESTRICT ON UPDATE CASCADE;
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'BatchStudent_batchId_fkey') THEN
        ALTER TABLE "BatchStudent"
            ADD CONSTRAINT "BatchStudent_batchId_fkey"
            FOREIGN KEY ("batchId") REFERENCES "Batch"("id")
            ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'BatchStudent_studentId_fkey') THEN
        ALTER TABLE "BatchStudent"
            ADD CONSTRAINT "BatchStudent_studentId_fkey"
            FOREIGN KEY ("studentId") REFERENCES "User"("id")
            ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Test_teacherId_fkey') THEN
        ALTER TABLE "Test"
            ADD CONSTRAINT "Test_teacherId_fkey"
            FOREIGN KEY ("teacherId") REFERENCES "User"("id")
            ON DELETE RESTRICT ON UPDATE CASCADE;
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Question_testId_fkey') THEN
        ALTER TABLE "Question"
            ADD CONSTRAINT "Question_testId_fkey"
            FOREIGN KEY ("testId") REFERENCES "Test"("id")
            ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'TestAssignment_testId_fkey') THEN
        ALTER TABLE "TestAssignment"
            ADD CONSTRAINT "TestAssignment_testId_fkey"
            FOREIGN KEY ("testId") REFERENCES "Test"("id")
            ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'TestAssignment_batchId_fkey') THEN
        ALTER TABLE "TestAssignment"
            ADD CONSTRAINT "TestAssignment_batchId_fkey"
            FOREIGN KEY ("batchId") REFERENCES "Batch"("id")
            ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'TestAssignment_studentId_fkey') THEN
        ALTER TABLE "TestAssignment"
            ADD CONSTRAINT "TestAssignment_studentId_fkey"
            FOREIGN KEY ("studentId") REFERENCES "User"("id")
            ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'TestSession_testId_fkey') THEN
        ALTER TABLE "TestSession"
            ADD CONSTRAINT "TestSession_testId_fkey"
            FOREIGN KEY ("testId") REFERENCES "Test"("id")
            ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'TestSession_studentId_fkey') THEN
        ALTER TABLE "TestSession"
            ADD CONSTRAINT "TestSession_studentId_fkey"
            FOREIGN KEY ("studentId") REFERENCES "User"("id")
            ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'AIFeedback_testSessionId_fkey') THEN
        ALTER TABLE "AIFeedback"
            ADD CONSTRAINT "AIFeedback_testSessionId_fkey"
            FOREIGN KEY ("testSessionId") REFERENCES "TestSession"("id")
            ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'AuditLog_userId_fkey') THEN
        ALTER TABLE "AuditLog"
            ADD CONSTRAINT "AuditLog_userId_fkey"
            FOREIGN KEY ("userId") REFERENCES "User"("id")
            ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;
