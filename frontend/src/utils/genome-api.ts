export interface GenomeAssemblyFromSearch {
  organism: string;
  id: string;
  name: string;
  sourceName: string;
  active: boolean;

  scientificName?: string;
}

interface GenomeApiResponse {
  ucscGenomes: GenomeAssemblyFromSearch[];
}

export interface chromosomeFromSearch {
  name: string;
  size: number;
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
      name: genomeInfo?.scientificName ?? genomeId,
      sourceName: genomeInfo.sourceName || genomeId,
      active: !!genomeInfo.active, // 1 = true, 0 = false
      organism: genomeInfo.organism || "Unknown",
    });
  }

  return { genomes: structuredGenomes };
}

export async function getGenomeChromosomes(genomeId: string) {
  const apiUrl = `https://api.genome.ucsc.edu/list/chromosomes?genome=${genomeId}`;
  const response = await fetch(apiUrl);
  if (!response.ok) {
    throw new Error("Failed to fetch chromosome list from UCSC API");
  }

  const chromosomeData = (await response.json()) as {
    chromosomes: chromosomeFromSearch[];
  };
  if (!chromosomeData.chromosomes) {
    throw new Error("UCSC API Error: missing chromosomes");
  }

  const chromosomes: chromosomeFromSearch[] = [];
  // eslint-disable-next-line @typescript-eslint/no-for-in-array
  for (const chromId in chromosomeData.chromosomes) {
    if (
      chromId.includes("_") ||
      chromId.includes("Un") ||
      chromId.includes("random")
    )
      continue;
    chromosomes.push({
      name: chromId,
      size: chromosomeData.chromosomes[chromId],
    });
  }

  //  chr1, chr2, chr3, ..., chrX, chrY
  chromosomes.sort((a, b) => {
    const numA = a.name.replace("chr", "");
    const numB = b.name.replace("chr", "");
    // Check if both are numeric
    const isNumA = /^\d+$/.test(numA);
    const isNumB = /^\d+$/.test(numB);
    if (isNumA && isNumB) return Number(numA) - Number(numB);
    if (isNumA) return -1; // Numeric comes before non-numeric
    if (isNumB) return 1; // Non-numeric comes after numeric
    return numA.localeCompare(numB); // Compare non-numeric strings
  });

  return { chromosomes };
}
