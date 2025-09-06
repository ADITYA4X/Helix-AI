"use client";

import type { ClinvarVariant, GeneFromSearch } from "~/utils/genome-api";
import { Card, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";

export default function KnownVariants({
  refreshVariants,
  showComparison,
  updateClinvarVariant,
  clinvarVariants,
  isLoadingClinvar,
  clinvarError,
  genomeId,
  gene,
}: {
  refreshVariants: () => void;
  showComparison: (variant: ClinvarVariant) => void;
  updateClinvarVariant: (id: string, newVariant: ClinvarVariant) => void;
  clinvarVariants: ClinvarVariant[];
  isLoadingClinvar: boolean;
  clinvarError: string | null;
  genomeId: string;
  gene: GeneFromSearch;
}) {
  return (
    <Card className="gap-0 border-none bg-white py-0 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pt-4 pb-2">
        <CardTitle className="text-sm font-normal text-[#4f473c]/70">
          Known Variants in Gene from ClinVar
        </CardTitle>
        <Button
          variant="ghost"
          size="sm"
          onClick={refreshVariants}
          disabled={isLoadingClinvar}
          className="h-7 cursor-pointer text-xs text-[#4f473c] hover:bg-[#e9eeea]/70"
        >
          Refresh
        </Button>
      </CardHeader>
    </Card>
  );
}
