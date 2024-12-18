-- AlterTable
ALTER TABLE "CareerRecomendation" ADD COLUMN     "isEnrolled" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "CourseSection" ADD COLUMN     "sectionDescription" TEXT;

-- CreateTable
CREATE TABLE "Interview" (
    "id" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "feedback" TEXT NOT NULL,
    "score" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Interview_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Interview" ADD CONSTRAINT "Interview_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
