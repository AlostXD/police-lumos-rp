import prisma from "@/utils/prisma";
import CrimeSelector from "@/components/CrimeSelector";
import type { Crime } from "@/types";

export default async function Home() {
  const crimes: Crime[] = await prisma.crime.findMany();

  return (
    <main className="flex flex-col items-center min-h-screen p-4">
      <CrimeSelector crimes={crimes} />
    </main>
  );
}
