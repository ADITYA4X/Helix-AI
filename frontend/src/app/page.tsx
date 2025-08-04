/* eslint-disable @typescript-eslint/no-unused-vars */
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
import { ThemeToggle } from "~/components/ThemeToggle";
import {
  getAvailableGenomes,
  getGenomeChromosomes,
  type GenomeAssemblyFromSearch,
  type chromosomeFromSearch,
} from "~/utils/genome-api";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Search } from "lucide-react";

type Mode = "search" | "browse";

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [genomes, setGenomes] = useState<GenomeAssemblyFromSearch[]>([]);
  const [selectedGenome, setSelectedGenome] = useState<string>("hg38");
  const [chromosomes, setChromosomes] = useState<chromosomeFromSearch[]>([]);
  const [selectedChromosome, setSelectedChromosome] = useState<string>("chr1");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [mode, setMode] = useState<Mode>("search");

  useEffect(() => {
    const fetchGenomes = async () => {
      try {
        setIsLoading(true);
        const data = await getAvailableGenomes();
        if (data.genomes?.Human) {
          setGenomes(data.genomes.Human);
          // console.log("Fetched genomes:", data.genomes.Human);
        }
      } catch (err) {
        console.error("Error fetching genomes:", err);
        setError("Failed to load genomes data");
      } finally {
        setIsLoading(false);
      }
    };
    void fetchGenomes();
  }, []);

  useEffect(() => {
    const fetchChromosomes = async () => {
      try {
        setIsLoading(true);
        const data = await getGenomeChromosomes(selectedGenome);
        setChromosomes(data.chromosomes);
        console.log("Fetched chromosomes:", data.chromosomes);
        if (data.chromosomes.length > 0) {
          setSelectedChromosome(data.chromosomes[0]!.name);
        }
      } catch (err) {
        console.error("Error fetching genomes:", err);
        setError("Failed to load chromosomes data");
      } finally {
        setIsLoading(false);
      }
    };
    void fetchChromosomes();
  }, [selectedGenome]);

  const handleGenomeChange = (value: string) => {
    setSelectedGenome(value);
  };

  const switchMode = (newMode: Mode) => {
    if (mode === newMode) return;
    setMode(newMode);
  };

  const handleSearch = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!searchQuery.trim()) return;

    // TODO: Implement Perforn gene search logic here
  };

  const loadBRCA1Example = () => {
    setMode("search");
    setSearchQuery("BRCA1");
    void handleSearch();
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
                Genome Assembly
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
              <p className="mt-2 text-xs text-[#4f463c]/70">
                {
                  genomes.find((genome) => genome.id === selectedGenome)
                    ?.sourceName
                }
              </p>
            )}
          </CardContent>
        </Card>

        <Card className="mt-6 gap-0 border-none bg-white py-0 shadow-sm">
          <CardHeader className="pt-4 pb-2">
            <CardTitle className="text-sm font-normal text-[#4f464c]/70">
              Browse
            </CardTitle>
          </CardHeader>

          <CardContent className="pb-4">
            <Tabs
              value={mode}
              onValueChange={(value) => switchMode(value as Mode)}
            >
              <TabsList className="mb-4 bg-[#eeece9]">
                <TabsTrigger
                  className="data-[state=active]:bg-white data-[state=active]:text-[#4f464c]"
                  value="search"
                >
                  Search Genes
                </TabsTrigger>
                <TabsTrigger
                  className="data-[state=active]:bg-white data-[state=active]:text-[#4f464c]"
                  value="browse"
                >
                  Browse Chromosomes
                </TabsTrigger>
              </TabsList>

              <TabsContent value="search" className="mt-0">
                <div className="space-y-4">
                  <form
                    onSubmit={handleSearch}
                    className="flex flex-col gap-3 sm:flex-row sm:items-center"
                  >
                    <div className="relative flex-1">
                      <Input
                        type="text"
                        placeholder="Enter a gene name or symbol"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="h-9 w-full border-[#4f483c]/10 pr-10"
                      />
                      <Button
                        type="submit"
                        disabled={isLoading || !searchQuery.trim()}
                        className="absolute top-0 right-0 h-full cursor-pointer rounded-l-none bg-[#4f483c] text-white hover:bg-black"
                        size="icon"
                      >
                        <Search className="h-4 w-4" />
                        <span className="sr-only">Search</span>
                      </Button>
                    </div>
                  </form>
                  <Button
                    variant="link"
                    className="h-auto cursor-pointer p-0 text-[#e08243] hover:text-[#de8246]/80"
                    onClick={loadBRCA1Example}
                  >
                    Try BRCA1 example
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="browse" className="mt-0">
                <div className="max-h-[150px] overflow-y-auto pr-1">
                  <div className="flex flex-wrap gap-2">
                    {chromosomes.map((chrom) => (
                      <Button
                        key={chrom.name}
                        variant="outline"
                        size="sm"
                        className={`h-8 cursor-pointer border-[#4f483c]/10 text-xs hover:bg-[#e9eeea] hover:text-[#4f483c] ${selectedChromosome === chrom.name ? "border-1 bg-[#eeece9] text-black" : ""}`}
                        onClick={() => setSelectedChromosome(chrom.name)}
                      >
                        {chrom.name}
                      </Button>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            {isLoading && (
              <div className="flex justify-center py-4">
                <div className="boder-[#4f483c]/30 h-6 w-6 animate-spin rounded-full border-2 border-t-[#de8246]"></div>
              </div>
            )}

            {error && (
              <div className="mt-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-600">
                {error}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
