DO $$
DECLARE
    canonical_admin_id UUID;
BEGIN
    SELECT id
    INTO canonical_admin_id
    FROM "User"
    WHERE "role" = 'ADMIN'
    ORDER BY ("status" = 'ACTIVE') DESC, "createdAt" ASC, id ASC
    LIMIT 1;

    IF canonical_admin_id IS NULL THEN
        RAISE EXCEPTION 'Part 5 migration requires at least one ADMIN user';
    END IF;

    UPDATE "User"
    SET "status" = 'ACTIVE'
    WHERE id = canonical_admin_id
      AND "status" <> 'ACTIVE';

    UPDATE "Test"
    SET "createdById" = canonical_admin_id
    WHERE "createdById" IS DISTINCT FROM canonical_admin_id
       OR "createdById" IS NULL;
END $$;

ALTER TABLE "Batch" DROP CONSTRAINT IF EXISTS "Batch_teacherId_fkey";
ALTER TABLE "Test" DROP CONSTRAINT IF EXISTS "Test_teacherId_fkey";
ALTER TABLE "Test" DROP CONSTRAINT IF EXISTS "Test_createdById_fkey";

ALTER TABLE "Batch" DROP COLUMN IF EXISTS "teacherId";
ALTER TABLE "Test" DROP COLUMN IF EXISTS "teacherId";
ALTER TABLE "Test" DROP COLUMN IF EXISTS "scheduledAt";

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
        RAISE EXCEPTION 'Part 5 migration requires at least one ADMIN user';
    END IF;

    DELETE FROM "User"
    WHERE "role" = 'TEACHER';

    DELETE FROM "User"
    WHERE "role" = 'ADMIN'
      AND id <> canonical_admin_id;

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

        INSERT INTO "Batch" ("id", "name", "code", "kind", "status", "createdAt")
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
            'ACTIVE',
            CURRENT_TIMESTAMP
        );
    ELSE
        UPDATE "Batch"
        SET
            "name" = 'FREE-Batch',
            "code" = 'FREE-BATCH',
            "kind" = 'FREE_SYSTEM',
            "status" = 'ACTIVE'
        WHERE id = free_batch_id;
    END IF;
END $$;

ALTER TABLE "Test"
    ALTER COLUMN "createdById" SET NOT NULL;

ALTER TABLE "Test"
    ADD CONSTRAINT "Test_createdById_fkey"
    FOREIGN KEY ("createdById") REFERENCES "User"("id")
    ON DELETE RESTRICT ON UPDATE CASCADE;

DROP INDEX IF EXISTS "User_single_active_admin_key";

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'Role_next') THEN
        DROP TYPE "Role_next";
    END IF;
END $$;

CREATE TYPE "Role_next" AS ENUM ('ADMIN', 'STUDENT');

ALTER TABLE "User"
    ALTER COLUMN "role" DROP DEFAULT;

ALTER TABLE "User"
    ALTER COLUMN "role" TYPE "Role_next"
    USING ("role"::text::"Role_next");

DROP TYPE "Role";

ALTER TYPE "Role_next" RENAME TO "Role";

ALTER TABLE "User"
    ALTER COLUMN "role" SET DEFAULT 'STUDENT';

CREATE UNIQUE INDEX IF NOT EXISTS "User_single_active_admin_key"
    ON "User"("role")
    WHERE "role" = 'ADMIN' AND "status" = 'ACTIVE';
