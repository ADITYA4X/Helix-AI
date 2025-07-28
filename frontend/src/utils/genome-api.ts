export interface GenomeAssemblyFromSearch {
  organism: string;
  id: string;
  name: string;
  sourceName: string;
  active: boolean;
  genomeId: number;
}

interface GenomeApiResponse {
  ucscGenomes: GenomeAssemblyFromSearch[];
}

export async function getAvailableGenomes() {
  const apiUrl = "https://api.genome.ucsc.edu/list/ucscGenomes";
  const response = await fetch(apiUrl);
  if (!response.ok) {
    throw new Error("Failed to fetch genome list from UCSC API");
  }

  const genomeData: GenomeApiResponse =
    (await response.json()) as GenomeApiResponse;
  if (!genomeData.ucscGenomes) {
    throw new Error("UCSC API Error: missing ucscGenomes");
  }
  const genomes = genomeData.ucscGenomes;
  const structuredGenomes: Record<string, GenomeAssemblyFromSearch[]> = {};

  // eslint-disable-next-line @typescript-eslint/no-for-in-array
  for (const genomeId in genomes) {
    const genomeInfo = genomes[genomeId]!;
    const organism = genomeInfo.organism ?? "Other";

    structuredGenomes[organism] ??= [];
    structuredGenomes[organism].push({
      id: genomeId,
      name: genomeInfo?.description ?? genomeId,
      sourceName: genomeInfo.sourceName || genomeId,
      active: !!genomeInfo.active,
      organism: "",
      genomeId: 0,
    });
  }

  return { genomes: structuredGenomes };
}
