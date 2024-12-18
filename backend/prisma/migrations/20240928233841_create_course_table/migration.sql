-- CreateTable
CREATE TABLE "CourseSection" (
    "courseTitle" TEXT NOT NULL,
    "sectionTitle" TEXT NOT NULL,
    "sectionContent" TEXT NOT NULL,
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "provider" "FileProvider" NOT NULL DEFAULT 'PATH',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CourseSection_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CourseSection" ADD CONSTRAINT "CourseSection_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
