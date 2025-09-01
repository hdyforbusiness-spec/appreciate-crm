-- Alternative simpler migration for SQLite
-- This approach might work better with SQLite's limitations

-- First drop the index on isDeleted column
DROP INDEX "bookings_isDeleted_idx";

-- For SQLite, we need to handle column removal differently
-- Option 1: Use PRAGMA to disable foreign key constraints temporarily
PRAGMA foreign_keys=OFF;

-- Option 2: If the above doesn't work, you may need to manually edit the schema
-- and use Prisma's db push or create a new migration

-- Note: If you encounter issues, you can also:
-- 1. Export your data
-- 2. Drop the table completely
-- 3. Let Prisma recreate it with the new schema
-- 4. Re-import your data
