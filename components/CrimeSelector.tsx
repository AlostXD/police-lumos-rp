"use client";
import { useState, useRef, useEffect } from "react";

type CrimeType = {
  id: number;
  article: string;
  title: string;
  description: string;
  time: number;
  fine: number;
  fiance: number;
  financable: boolean;
};

// Agora SelectedCrime tem multiplier
type SelectedCrime = CrimeType & { multiplier: number };

export default function CrimeSelector({ crimes }: { crimes: CrimeType[] }) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCrimes, setSelectedCrimes] = useState<SelectedCrime[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [reductionMonths, setReductionMonths] = useState<number | "">("");
  const [reductionFine, setReductionFine] = useState<number | "">("");
  const [bailPaid, setBailPaid] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Filtra crimes de acordo com a pesquisa
  const filteredCrimes =
    query === ""
      ? crimes
      : crimes.filter(
          (c) =>
            c.title.toLowerCase().includes(query.toLowerCase()) ||
            c.article.toLowerCase().includes(query.toLowerCase())
        );

  const handleAddCrime = (crime: CrimeType) => {
    if (!selectedCrimes.find((c) => c.id === crime.id)) {
      setSelectedCrimes((prev) => [...prev, { ...crime, multiplier: 1 }]);
    }
    setQuery("");
    setIsOpen(false);
    setActiveIndex(0);
  };

  const handleRemoveCrime = (id: number) => {
    setSelectedCrimes((prev) => prev.filter((c) => c.id !== id));
  };

  // Totais considerando multiplier
  const totalTime = selectedCrimes.reduce(
    (acc, c) => acc + c.time * c.multiplier,
    0
  );
  const totalFine = selectedCrimes.reduce(
    (acc, c) => acc + c.fine * c.multiplier,
    0
  );
  const totalFiance = bailPaid
    ? selectedCrimes.reduce(
        (acc, c) => acc + (c.financable ? c.fiance * c.multiplier : 0),
        0
      )
    : 0;

  // Aplica fiança: remove meses de crimes financiáveis se checkbox ativo
  const timeAfterBail = bailPaid
    ? selectedCrimes.reduce(
        (acc, c) => acc + (c.financable ? 0 : c.time * c.multiplier),
        0
      )
    : totalTime;

  // Aplica reduções
  const finalTime =
    reductionMonths && reductionMonths > 0
      ? timeAfterBail * (1 - reductionMonths / 100)
      : timeAfterBail;

  const finalFine =
    reductionFine && reductionFine > 0
      ? totalFine * (1 - reductionFine / 100)
      : totalFine;

  // Fechar dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setActiveIndex(0);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Navegação por teclado
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => (prev + 1) % filteredCrimes.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) =>
        prev === 0 ? filteredCrimes.length - 1 : prev - 1
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      const crime = filteredCrimes[activeIndex];
      if (crime) handleAddCrime(crime);
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen p-6 gap-4 bg-[#171717] text-white">
      <h1 className="text-lg font-semibold">Selecionar Crimes</h1>

      {/* Autocomplete container */}
      <div className="relative w-full max-w-md" ref={containerRef}>
        <input
          type="text"
          placeholder="Digite artigo ou título..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          className="w-full border border-gray-600 rounded-md px-3 py-2 bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white placeholder-gray-400"
        />

        {isOpen && filteredCrimes.length > 0 && (
          <ul className="absolute z-20 w-full mt-1 max-h-60 overflow-auto rounded-md border border-gray-700 bg-gray-800 shadow-lg scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-900">
            {filteredCrimes.map((crime, index) => (
              <li
                key={crime.id}
                className={`cursor-pointer px-3 py-2 select-none ${
                  index === activeIndex
                    ? "bg-indigo-600 text-white"
                    : "text-gray-200 hover:bg-gray-700 hover:text-white"
                }`}
                onMouseEnter={() => setActiveIndex(index)}
                onClick={() => handleAddCrime(crime)}
              >
                {crime.article} - {crime.title}{" "}
                {crime.financable && (
                  <span className="text-green-400">(Fiançável)</span>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Lista de crimes selecionados */}
      <div className="w-full max-w-md">
        <h2 className="font-semibold text-lg mt-4">Crimes Selecionados</h2>
        <ul className="mt-2 space-y-2">
          {selectedCrimes.map((crime, index) => (
            <li
              key={crime.id}
              className="flex justify-between items-center border border-gray-600 p-2 rounded-md gap-2"
            >
              <span>
                {crime.article} - {crime.title}{" "}
                {crime.financable && (
                  <span className="text-green-400">(Fiançável)</span>
                )}
              </span>

              {/* Input de multiplicador */}
              <input
                type="number"
                min={1}
                value={crime.multiplier}
                onChange={(e) => {
                  const value = Number(e.target.value) || 1;
                  setSelectedCrimes((prev) =>
                    prev.map((c, i) =>
                      i === index ? { ...c, multiplier: value } : c
                    )
                  );
                }}
                className="w-16 border border-gray-600 rounded-md px-2 py-1 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />

              <button
                onClick={() => handleRemoveCrime(crime.id)}
                className="text-red-500 hover:underline"
              >
                Remover
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Checkbox de fiança */}
      <div className="w-full max-w-md flex items-center gap-2 mt-4">
        <input
          type="checkbox"
          checked={bailPaid}
          onChange={(e) => setBailPaid(e.target.checked)}
          className="w-4 h-4"
        />
        <label>Fiança paga (aplica apenas aos crimes fiançáveis)</label>
      </div>

      {/* Inputs de redução */}
      <div className="w-full max-w-md flex gap-4 mt-4">
        <div className="flex flex-col w-1/2">
          <label className="text-sm">Redução dos meses (%)</label>
          <input
            type="number"
            min={0}
            max={100}
            value={reductionMonths}
            onChange={(e) =>
              setReductionMonths(
                e.target.value === "" ? "" : Number(e.target.value)
              )
            }
            className="border border-gray-600 rounded-md px-2 py-1 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Ex: 30"
          />
        </div>
        <div className="flex flex-col w-1/2">
          <label className="text-sm">Redução da multa (%)</label>
          <input
            type="number"
            min={0}
            max={100}
            value={reductionFine}
            onChange={(e) =>
              setReductionFine(
                e.target.value === "" ? "" : Number(e.target.value)
              )
            }
            className="border border-gray-600 rounded-md px-2 py-1 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Ex: 30"
          />
        </div>
      </div>

      {/* Calculadora */}
      <div className="w-full max-w-md border-t border-gray-600 pt-4 mt-4">
        <h2 className="font-semibold text-lg">Resumo</h2>
        <p>
          Tempo total: {finalTime} meses{" "}
          {reductionMonths ? `(reduzido ${reductionMonths}%)` : ""}
        </p>
        <p>Multa: $ {finalFine}</p>
        {bailPaid && <p>Fiança: $ {totalFiance}</p>}

        {/* Mensagem dos artigos com multiplicador */}
        <h2 className="pt-4">Mensagem para colocar na prisão com artigos:</h2>
        {selectedCrimes.length > 0 && (
          <p className="mt-2 text-gray-300">
            {selectedCrimes
              .map(
                (c) =>
                  `${c.article} - ${c.title}` +
                  (c.multiplier > 1 ? ` (x${c.multiplier})` : "")
              )
              .join(" | ")}
          </p>
        )}
      </div>
    </div>
  );
}
