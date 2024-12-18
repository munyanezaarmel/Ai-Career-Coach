/*
  Warnings:

  - You are about to drop the column `answer` on the `CareerRecomendation` table. All the data in the column will be lost.
  - You are about to drop the column `question` on the `CareerRecomendation` table. All the data in the column will be lost.
  - Added the required column `buttonText` to the `CareerRecomendation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `CareerRecomendation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `CareerRecomendation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CareerRecomendation" DROP COLUMN "answer",
DROP COLUMN "question",
ADD COLUMN     "buttonText" TEXT NOT NULL,
ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "title" TEXT NOT NULL;
