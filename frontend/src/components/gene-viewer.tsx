"use client";

import {
  type GeneFromSearch,
  type GeneDetailsFromSearch,
  fetchGeneDetails,
  type GeneBounds,
} from "~/utils/genome-api";
import { Button } from "./ui/button";
import { ArrowLeftIcon } from "lucide-react";
import { useEffect, useState } from "react";

export default function GeneViewer({
  gene,
  genomeId,
  onClose,
}: {
  gene: GeneFromSearch;
  genomeId: string;
  onClose: () => void;
}) {
  const [geneDetail, setGeneDetail] = useState<GeneDetailsFromSearch | null>(
    null,
  );
  const [geneBounds, setGeneBounds] = useState<GeneBounds | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [startPosition, setStartPosition] = useState<string>("");
  const [endPosition, setEndPosition] = useState<string>("");

  useEffect(() => {
    const initializeGeneData = async () => {
      setIsLoading(true);
      setError(null);
      setGeneDetail(null);
      setStartPosition("");
      setEndPosition("");

      if (!gene.gene_id) {
        setError("Gene ID is missing, can not fetch details.");
        setIsLoading(false);
        return;
      }

      try {
        const { geneDetails, geneBounds, initialRange } =
          await fetchGeneDetails(gene.gene_id);
        setGeneDetail(geneDetails);
        setGeneBounds(geneBounds);

        if (initialRange) {
          setStartPosition(initialRange.start.toString());
          setEndPosition(initialRange.end.toString());
        }
      } catch {
        setError("Failed to load gene information. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    void initializeGeneData();
  }, [gene, genomeId]);

  return (
    <div className="space-y-6">
      <Button
        variant="ghost"
        size="sm"
        className="flex cursor-pointer items-center text-[#4f493c] hover:bg-[#eeece9]/70"
        onClick={onClose}
      >
        <ArrowLeftIcon className="mr-2 h-4 w-4" />
        Back to results
      </Button>
    </div>
  );
}
