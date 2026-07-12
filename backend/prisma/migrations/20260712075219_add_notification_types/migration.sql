-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "NotificationType" ADD VALUE 'ASSET_RETURNED';
ALTER TYPE "NotificationType" ADD VALUE 'AUDIT_ASSIGNED';
ALTER TYPE "NotificationType" ADD VALUE 'AUDIT_CLOSED';
ALTER TYPE "NotificationType" ADD VALUE 'USER_ROLE_CHANGED';
