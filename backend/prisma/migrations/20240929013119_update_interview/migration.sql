/*
  Warnings:

  - You are about to drop the column `answer` on the `Interview` table. All the data in the column will be lost.
  - You are about to drop the column `feedback` on the `Interview` table. All the data in the column will be lost.
  - You are about to drop the column `question` on the `Interview` table. All the data in the column will be lost.
  - You are about to drop the column `score` on the `Interview` table. All the data in the column will be lost.
  - Added the required column `confidenceScore` to the `Interview` table without a default value. This is not possible if the table is not empty.
  - Added the required column `overallAssessment` to the `Interview` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Interview" DROP CONSTRAINT "Interview_userId_fkey";

-- AlterTable
ALTER TABLE "Interview" DROP COLUMN "answer",
DROP COLUMN "feedback",
DROP COLUMN "question",
DROP COLUMN "score",
ADD COLUMN     "areasForImprovement" TEXT[],
ADD COLUMN     "bodyLanguage" TEXT,
ADD COLUMN     "communicationSkills" TEXT,
ADD COLUMN     "confidenceScore" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "keyStrengths" TEXT[],
ADD COLUMN     "overallAssessment" TEXT NOT NULL,
ADD COLUMN     "suggestions" TEXT[];

-- AddForeignKey
ALTER TABLE "Interview" ADD CONSTRAINT "Interview_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
