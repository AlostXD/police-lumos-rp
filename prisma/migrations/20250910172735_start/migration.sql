-- CreateTable
CREATE TABLE "public"."Officer" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "badge" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Officer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Crime" (
    "id" UUID NOT NULL,
    "article" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "prisonTime" INTEGER NOT NULL,
    "fine" DOUBLE PRECISION NOT NULL,
    "bailable" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "prisonRecordId" UUID,

    CONSTRAINT "Crime_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."PrisonRecord" (
    "id" UUID NOT NULL,
    "responsibleOfficerId" UUID NOT NULL,
    "prisonerName" TEXT NOT NULL,
    "report" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PrisonRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."_InvolvedOfficers" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL,

    CONSTRAINT "_InvolvedOfficers_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Officer_email_key" ON "public"."Officer"("email");

-- CreateIndex
CREATE INDEX "_InvolvedOfficers_B_index" ON "public"."_InvolvedOfficers"("B");

-- AddForeignKey
ALTER TABLE "public"."Crime" ADD CONSTRAINT "Crime_prisonRecordId_fkey" FOREIGN KEY ("prisonRecordId") REFERENCES "public"."PrisonRecord"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PrisonRecord" ADD CONSTRAINT "PrisonRecord_responsibleOfficerId_fkey" FOREIGN KEY ("responsibleOfficerId") REFERENCES "public"."Officer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_InvolvedOfficers" ADD CONSTRAINT "_InvolvedOfficers_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Officer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_InvolvedOfficers" ADD CONSTRAINT "_InvolvedOfficers_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."PrisonRecord"("id") ON DELETE CASCADE ON UPDATE CASCADE;
