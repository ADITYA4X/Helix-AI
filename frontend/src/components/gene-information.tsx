import type {
  GeneBounds,
  GeneDetailsFromSearch,
  GeneFromSearch,
} from "~/utils/genome-api";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { ExternalLink } from "lucide-react";

export function GeneInformation({
  gene,
  geneDetail,
  geneBounds,
}: {
  gene: GeneFromSearch;
  geneDetail: GeneDetailsFromSearch | null;
  geneBounds: GeneBounds | null;
}) {
  return (
    <Card className="gap-0 border-none bg-white py-0 shadow-sm">
      <CardHeader className="pt-4 pb-2">
        <CardTitle className="text-sm font-normal text-[#4f463c]/90">
          Gene Information :
        </CardTitle>
      </CardHeader>
      <CardContent className="pb-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <div className="flex">
              <span className="min-28 w-28 text-xs text-[#4f463c]/80">
                Symbol:
              </span>
              <span className="text-xs">{gene.symbol}</span>
            </div>
            <div className="flex">
              <span className="min-28 w-28 text-xs text-[#4f463c]/80">
                Name:
              </span>
              <span className="text-xs">{gene.name}</span>
            </div>
            {gene.description && gene.description !== gene.name && (
              <div className="flex">
                <span className="min-28 w-28 text-xs text-[#4f463c]/80">
                  Description:
                </span>
                <span className="text-xs">{gene.description}</span>
              </div>
            )}
            <div className="flex">
              <span className="min-28 w-28 text-xs text-[#4f463c]/80">
                Chromosome:
              </span>
              <span className="text-xs">{gene.chrom}</span>
            </div>
            {geneBounds && (
              <div className="flex">
                <span className="min-28 w-28 text-xs text-[#4f463c]/80">
                  Position:
                </span>
                <span className="text-xs text-[#4f463c]">
                  {Math.min(geneBounds.min, geneBounds.max).toLocaleString()} -{" "}
                  {Math.max(geneBounds.min, geneBounds.max).toLocaleString()} (
                  {Math.abs(
                    geneBounds.max - geneBounds.min + 1,
                  ).toLocaleString()}{" "}
                  bp)
                  {geneDetail?.genomicInfo?.[0]?.strand === "-" &&
                    " (reverse strand)"}
                </span>
              </div>
            )}
          </div>

          <div className="spac-y-2">
            {gene.gene_id && (
              <div className="flex">
                <span className="min-28 w-28 text-xs text-[#4f463c]/80">
                  Gene ID:
                </span>
                <span className="text-xs">
                  <a
                    href={`https://www.ncbi.nlm.nih.gov/gene/${gene.gene_id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-blue-600 hover:underline"
                  >
                    {gene.gene_id}
                    <ExternalLink className="ml-1 inline-block h-3 w-3" />
                  </a>
                </span>
              </div>
            )}

            {geneDetail?.organism && (
              <div className="flex">
                <span className="w-28 text-xs text-[#4f463c]/80">
                  Organism:
                </span>
                <span className="text-xs">
                  {geneDetail.organism.scientificname}{" "}
                  {geneDetail.organism.commonname &&
                    ` (${geneDetail.organism.commonname})`}
                </span>
              </div>
            )}

            {geneDetail?.summary && (
              <div className="mt-4">
                <h3 className="mb-2 text-xs font-medium text-[#4f463c]">
                  Summary:
                </h3>
                <p className="text-justify text-xs leading-relaxed text-[#4f463c]/80">
                  {geneDetail.summary}
                </p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
