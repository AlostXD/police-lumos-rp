"use client";

import FormularioPrisao from "@/components/FormularioPrisao";
import { useState } from "react";

export default function Home() {
  const [menu, setMenu] = useState("");

  if (menu === "Prisão") {
    return <div className="flex flex-col items-center min-h-screen">
      <h1 className="text-3xl font-bold mt-10">Relatório de Prisão</h1>
      {/* Conteúdo do relatório de prisão */}
      <FormularioPrisao />
    </div>;
  }

  return <button onClick={() => setMenu("Prisão")}>Clica ai</button>
}
