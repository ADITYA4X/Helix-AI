"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import {
  getAvailableGenomes,
  type GenomeAssemblyFromSearch,
} from "~/utils/genome-api";

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [genomes, setGenomes] = useState<GenomeAssemblyFromSearch[]>([]);
  const [selectedGenome, setSelectedGenome] = useState<string>("hg38");

  useEffect(() => {
    const fetchGenomes = async () => {
      try {
        setIsLoading(true);
        const data = await getAvailableGenomes();
        if (data.genomes?.Human) {
          setGenomes(data.genomes.Human);
        }
      } catch (error) {
        setError("Failed to load genomes data");
      } finally {
        setIsLoading(false);
      }
    };
    void fetchGenomes();
  }, []);

  const handleGenomeChange = (value: string) => {
    setSelectedGenome(value);
  };

  return (
    <div className="min-h-screen bg-[#eeede9] text-black dark:bg-black dark:text-white">
      <header className="border-b border-[#110e09]/50 bg-white">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <h1 className="text-xl font-normal tracking-wide text-[#4f463c]">
                <span className="px-[2px] font-normal text-orange-500">
                  Helix
                </span>
                <span className="bg-orange-500 px-1 font-normal text-white">
                  AI
                </span>
              </h1>
            </div>
            <span className="text-sm font-light text-[#4f463c]/70">
              Sequence Intelligence
            </span>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-6">
        <Card className="mb-6 gap-0 border-none bg-white py-0 shadow-sm">
          <CardHeader className="pt-4 pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-normal text-[#4f493c]/70">
                Helix Assembler
              </CardTitle>
              <div className="text-xs text-[#4f493c]/60">
                Organism: <span className="font-medium">Human</span>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pb-4">
            <Select
              value={selectedGenome}
              onValueChange={handleGenomeChange}
              disabled={isLoading}
            >
              <SelectTrigger className="h-9 w-full border-[#4f483c]/10">
                <SelectValue placeholder="Select genome assembly" />
              </SelectTrigger>
              <SelectContent>
                {isLoading ? (
                  <option value="" disabled>
                    Loading genomes...
                  </option>
                ) : (
                  genomes.map((genome) => (
                    <SelectItem key={genome.id} value={genome.id}>
                      {genome.id} - {genome.name}
                      {genome.active ? (
                        <span className="font-mono text-sm text-green-500">
                          [active]
                        </span>
                      ) : (
                        <span className="font-mono text-sm text-red-500">
                          [inactive]
                        </span>
                      )}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
            {selectedGenome && (
              <p className="mt-2 text-xs text-[#4f463c]/60">
                {
                  genomes.find((genome) => genome.id === selectedGenome)
                    ?.sourceName
                }
              </p>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
