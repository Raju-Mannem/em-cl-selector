-- CreateTable
CREATE TABLE "college" (
    "sno" DECIMAL(30,0) NOT NULL,
    "institute_code" TEXT NOT NULL,
    "institute_name" TEXT NOT NULL,
    "place" TEXT,
    "district_name" TEXT,
    "college_type" TEXT,
    "co_educ" TEXT,
    "affiliated_to" TEXT,

    CONSTRAINT "college_pkey" PRIMARY KEY ("sno")
);

-- CreateIndex
CREATE UNIQUE INDEX "college_institute_code_key" ON "college"("institute_code");
