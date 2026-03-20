DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'BatchKind') THEN
        CREATE TYPE "BatchKind" AS ENUM ('FREE_SYSTEM', 'STANDARD');
    END IF;
END $$;

ALTER TABLE "User"
    ADD COLUMN IF NOT EXISTS "phone" TEXT,
    ADD COLUMN IF NOT EXISTS "phoneNormalized" TEXT;

ALTER TABLE "Batch"
    ADD COLUMN IF NOT EXISTS "kind" "BatchKind";

ALTER TABLE "Test"
    ADD COLUMN IF NOT EXISTS "createdById" UUID;

ALTER TABLE "TestSession"
    ADD COLUMN IF NOT EXISTS "attemptNumber" INTEGER;

UPDATE "TestSession"
SET "attemptNumber" = ranked."nextAttemptNumber"
FROM (
    SELECT
        id,
        ROW_NUMBER() OVER (
            PARTITION BY "testId", "studentId"
            ORDER BY "startedAt" ASC, id ASC
        ) AS "nextAttemptNumber"
    FROM "TestSession"
) AS ranked
WHERE "TestSession"."id" = ranked.id
  AND (
      "TestSession"."attemptNumber" IS DISTINCT FROM ranked."nextAttemptNumber"
      OR "TestSession"."attemptNumber" IS NULL
  );

ALTER TABLE "TestSession"
    ALTER COLUMN "attemptNumber" SET DEFAULT 1,
    ALTER COLUMN "attemptNumber" SET NOT NULL;

UPDATE "Batch"
SET "kind" = 'STANDARD'
WHERE "kind" IS NULL;

ALTER TABLE "Batch"
    ALTER COLUMN "kind" SET DEFAULT 'STANDARD',
    ALTER COLUMN "kind" SET NOT NULL;

DO $$
DECLARE
    canonical_admin_id UUID;
    free_batch_id UUID;
    generated_free_batch_id TEXT;
BEGIN
    SELECT id
    INTO canonical_admin_id
    FROM "User"
    WHERE "role" = 'ADMIN'
    ORDER BY ("status" = 'ACTIVE') DESC, "createdAt" ASC, id ASC
    LIMIT 1;

    IF canonical_admin_id IS NULL THEN
        RAISE EXCEPTION 'Part 1 migration requires at least one ADMIN user to backfill Test.createdById and FREE-Batch';
    END IF;

    UPDATE "User"
    SET "status" = 'INACTIVE'
    WHERE "role" = 'ADMIN'
      AND "status" = 'ACTIVE'
      AND id <> canonical_admin_id;

    UPDATE "User"
    SET "status" = 'ACTIVE'
    WHERE id = canonical_admin_id
      AND "status" <> 'ACTIVE';

    UPDATE "Test"
    SET "createdById" = canonical_admin_id
    WHERE "createdById" IS NULL;

    WITH ranked_in_progress_sessions AS (
        SELECT
            id,
            ROW_NUMBER() OVER (
                PARTITION BY "testId", "studentId"
                ORDER BY "startedAt" DESC, id DESC
            ) AS row_number
        FROM "TestSession"
        WHERE "status" = 'IN_PROGRESS'
    )
    UPDATE "TestSession"
    SET
        "status" = 'FORCE_SUBMITTED',
        "submittedAt" = COALESCE("submittedAt", "serverDeadline", CURRENT_TIMESTAMP)
    FROM ranked_in_progress_sessions
    WHERE "TestSession"."id" = ranked_in_progress_sessions.id
      AND ranked_in_progress_sessions.row_number > 1;

    SELECT id
    INTO free_batch_id
    FROM "Batch"
    WHERE "code" = 'FREE-BATCH'
       OR "name" = 'FREE-Batch'
       OR "kind" = 'FREE_SYSTEM'
    ORDER BY
        CASE WHEN "code" = 'FREE-BATCH' THEN 0 ELSE 1 END,
        CASE WHEN "name" = 'FREE-Batch' THEN 0 ELSE 1 END,
        "createdAt" ASC,
        id ASC
    LIMIT 1;

    IF free_batch_id IS NULL THEN
        generated_free_batch_id := md5(random()::text || clock_timestamp()::text);

        INSERT INTO "Batch" ("id", "name", "code", "kind", "teacherId", "status", "createdAt")
        VALUES (
            (
                SUBSTRING(generated_free_batch_id FROM 1 FOR 8) || '-' ||
                SUBSTRING(generated_free_batch_id FROM 9 FOR 4) || '-' ||
                SUBSTRING(generated_free_batch_id FROM 13 FOR 4) || '-' ||
                SUBSTRING(generated_free_batch_id FROM 17 FOR 4) || '-' ||
                SUBSTRING(generated_free_batch_id FROM 21 FOR 12)
            )::UUID,
            'FREE-Batch',
            'FREE-BATCH',
            'FREE_SYSTEM',
            canonical_admin_id,
            'ACTIVE',
            CURRENT_TIMESTAMP
        );
    ELSE
        UPDATE "Batch"
        SET
            "name" = 'FREE-Batch',
            "code" = 'FREE-BATCH',
            "kind" = 'FREE_SYSTEM'
        WHERE id = free_batch_id;
    END IF;

    UPDATE "Batch"
    SET "kind" = 'STANDARD'
    WHERE "kind" = 'FREE_SYSTEM'
      AND "code" <> 'FREE-BATCH'
      AND "name" <> 'FREE-Batch';
END $$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Test_createdById_fkey') THEN
        ALTER TABLE "Test"
            ADD CONSTRAINT "Test_createdById_fkey"
            FOREIGN KEY ("createdById") REFERENCES "User"("id")
            ON DELETE SET NULL ON UPDATE CASCADE;
    END IF;
END $$;

CREATE TABLE IF NOT EXISTS "Lead" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "emailNormalized" TEXT,
    "phone" TEXT,
    "phoneNormalized" TEXT,
    "isReviewed" BOOLEAN NOT NULL DEFAULT false,
    "reviewedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Lead_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "LeadTestSession" (
    "id" UUID NOT NULL,
    "testId" UUID NOT NULL,
    "leadId" UUID NOT NULL,
    "status" "SessionStatus" NOT NULL DEFAULT 'IN_PROGRESS',
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "serverDeadline" TIMESTAMP(3) NOT NULL,
    "submittedAt" TIMESTAMP(3),
    "answers" JSONB,
    "score" INTEGER,
    "totalMarks" INTEGER NOT NULL,
    "percentage" DOUBLE PRECISION,

    CONSTRAINT "LeadTestSession_pkey" PRIMARY KEY ("id")
);

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'LeadTestSession_testId_fkey') THEN
        ALTER TABLE "LeadTestSession"
            ADD CONSTRAINT "LeadTestSession_testId_fkey"
            FOREIGN KEY ("testId") REFERENCES "Test"("id")
            ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'LeadTestSession_leadId_fkey') THEN
        ALTER TABLE "LeadTestSession"
            ADD CONSTRAINT "LeadTestSession_leadId_fkey"
            FOREIGN KEY ("leadId") REFERENCES "Lead"("id")
            ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Lead_has_contact_check') THEN
        ALTER TABLE "Lead"
            ADD CONSTRAINT "Lead_has_contact_check"
            CHECK ("emailNormalized" IS NOT NULL OR "phoneNormalized" IS NOT NULL);
    END IF;
END $$;

CREATE INDEX IF NOT EXISTS "User_phoneNormalized_idx" ON "User"("phoneNormalized");
CREATE INDEX IF NOT EXISTS "Batch_kind_idx" ON "Batch"("kind");
CREATE INDEX IF NOT EXISTS "Test_createdById_idx" ON "Test"("createdById");
CREATE INDEX IF NOT EXISTS "Lead_emailNormalized_idx" ON "Lead"("emailNormalized");
CREATE INDEX IF NOT EXISTS "Lead_phoneNormalized_idx" ON "Lead"("phoneNormalized");
CREATE INDEX IF NOT EXISTS "Lead_isReviewed_createdAt_idx" ON "Lead"("isReviewed", "createdAt");
CREATE INDEX IF NOT EXISTS "LeadTestSession_leadId_status_idx" ON "LeadTestSession"("leadId", "status");

CREATE UNIQUE INDEX IF NOT EXISTS "TestSession_testId_studentId_attemptNumber_key"
    ON "TestSession"("testId", "studentId", "attemptNumber");

CREATE UNIQUE INDEX IF NOT EXISTS "LeadTestSession_testId_leadId_key"
    ON "LeadTestSession"("testId", "leadId");

CREATE UNIQUE INDEX IF NOT EXISTS "User_single_active_admin_key"
    ON "User"("role")
    WHERE "role" = 'ADMIN' AND "status" = 'ACTIVE';

CREATE UNIQUE INDEX IF NOT EXISTS "Batch_single_free_system_kind_key"
    ON "Batch"("kind")
    WHERE "kind" = 'FREE_SYSTEM';

CREATE UNIQUE INDEX IF NOT EXISTS "TestSession_active_in_progress_key"
    ON "TestSession"("testId", "studentId")
    WHERE "status" = 'IN_PROGRESS';

CREATE UNIQUE INDEX IF NOT EXISTS "LeadTestSession_active_in_progress_key"
    ON "LeadTestSession"("testId", "leadId")
    WHERE "status" = 'IN_PROGRESS';

CREATE UNIQUE INDEX IF NOT EXISTS "TestAssignment_testId_batchId_unique_active"
    ON "TestAssignment"("testId", "batchId")
    WHERE "batchId" IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS "TestAssignment_testId_studentId_unique_active"
    ON "TestAssignment"("testId", "studentId")
    WHERE "studentId" IS NOT NULL;
