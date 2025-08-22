"use client";

import {
  fetchGeneDetails,
  fetchGeneSequence as fetchGeneSequenceApi,
  type GeneFromSearch,
  type GeneDetailsFromSearch,
  type GeneBounds,
} from "~/utils/genome-api";
import { Button } from "./ui/button";
import { ArrowLeftIcon } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { GeneInformation } from "./gene-information";
import { GeneSequence } from "./gene-sequence";

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
  const [geneSequence, setGeneSequence] = useState<string>("");
  const [isLoadingSequence, setIsLoadingSequence] = useState(false);

  const [actualRange, setActualRange] = useState<{
    start: number;
    end: number;
  } | null>(null);

  const fetchGeneSequence = useCallback(
    async (start: number, end: number) => {
      try {
        setIsLoadingSequence(true);
        setError(null);

        // console.log("Fetching gene sequence for range:", {
        //   chrom: gene.chrom,
        //   start,
        //   end,
        //   genomeId,
        // });

        const {
          sequence,
          actualRange: fetchedRange,
          error: apiError,
        } = await fetchGeneSequenceApi(gene.chrom, start, end, genomeId);

        setGeneSequence(sequence);
        setActualRange(fetchedRange);

        if (apiError) {
          setError(apiError);
        }
      } catch (error) {
        setError("Failed to fetch gene sequence data. Please try again.");
      } finally {
        setIsLoadingSequence(false);
      }
    },
    [gene.chrom, genomeId],
  );

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

      //   console.log("Fetching gene details for gene ID:", gene.gene_id);

      try {
        const {
          geneDetails: fetchedDetail,
          geneBounds: fetchedGeneBounds,
          initialRange: fetchedRange,
        } = await fetchGeneDetails(gene.gene_id);

        // console.log("Fetched gene details:", fetchedDetail);
        // console.log("Fetched gene bounds:", fetchedGeneBounds);
        // console.log("Fetched initial range:", fetchedRange);

        setGeneDetail(fetchedDetail);
        setGeneBounds(fetchedGeneBounds);

        if (fetchedRange) {
          setStartPosition(fetchedRange.start.toString());
          setEndPosition(fetchedRange.end.toString());
          await fetchGeneSequence(fetchedRange.start, fetchedRange.end);
        }
        // console.log("Gene details fetched successfully:", fetchedDetail);
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

      <GeneSequence
        geneBounds={geneBounds}
        geneDetail={geneDetail}
        startPosition={startPosition}
        endPosition={endPosition}
        onStartPositionChange={setStartPosition}
        onEndPositionChange={setEndPosition}
        sequenceData={geneSequence}
        sequenceRange={actualRange}
        isLoading={isLoadingSequence}
        error={error}
        onSequenceLoadRequest={function (): void {
          throw new Error("Function not implemented.");
        }}
        onSequenceClick={function (position: number, nucleotide: string): void {
          throw new Error("Function not implemented.");
        }}
        maxViewRange={10000}
      />

      <GeneInformation
        gene={gene}
        geneDetail={geneDetail}
        geneBounds={geneBounds}
      />
    </div>
  );
}
