-- CreateTable
CREATE TABLE "CareerRecomendation" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,

    CONSTRAINT "CareerRecomendation_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CareerRecomendation" ADD CONSTRAINT "CareerRecomendation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
