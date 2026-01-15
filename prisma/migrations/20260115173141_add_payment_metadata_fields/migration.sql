-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "currency" TEXT NOT NULL DEFAULT 'INR',
ADD COLUMN     "paymentMetadata" JSONB,
ADD COLUMN     "paymentOrderId" TEXT;
