/*
  Warnings:

  - You are about to drop the column `fileId` on the `movies` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "movies" DROP CONSTRAINT "movies_fileId_fkey";

-- DropIndex
DROP INDEX "movies_fileId_key";

-- AlterTable
ALTER TABLE "movies" DROP COLUMN "fileId",
ADD COLUMN     "banner_file_id" TEXT,
ADD COLUMN     "poster_file_id" TEXT;

-- AddForeignKey
ALTER TABLE "movies" ADD CONSTRAINT "movies_poster_file_id_fkey" FOREIGN KEY ("poster_file_id") REFERENCES "files"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "movies" ADD CONSTRAINT "movies_banner_file_id_fkey" FOREIGN KEY ("banner_file_id") REFERENCES "files"("id") ON DELETE SET NULL ON UPDATE CASCADE;
