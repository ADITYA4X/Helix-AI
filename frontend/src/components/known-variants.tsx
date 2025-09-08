"use client";

import type { ClinvarVariant, GeneFromSearch } from "~/utils/genome-api";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { ExternalLink, Shield, TextCursorInput, Zap } from "lucide-react";
import { getClassificationColorClasses } from "~/utils/coloring-utils";

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
          className="h-7 cursor-pointer bg-[#e9eeea] text-xs text-[#4f473c] hover:bg-[#e9eeea]/70"
        >
          Refresh
        </Button>
      </CardHeader>

      <CardContent className="pb-4">
        {clinvarError && (
          <div className="mb-4 rounded-md bg-red-50 p-3 text-xs text-red-600">
            {clinvarError}
          </div>
        )}

        {isLoadingClinvar ? (
          <div className="flex justify-center py-6">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#4f473c]/30 border-t-[#4f473c]"></div>
          </div>
        ) : clinvarVariants.length > 0 ? (
          <div className="h-96 max-h-96 overflow-y-scroll rounded-md border border-[#4f473c]/5">
            <Table>
              <TableHeader className="sticky top-0 z-10">
                <TableRow className="bg-[#e9eeea]/80 hover:bg-[#e9eeea]/30">
                  <TableHead className="py-2 text-xs font-medium text-[#4f473c]">
                    Variant
                  </TableHead>
                  <TableHead className="py-2 text-xs font-medium text-[#4f473c]">
                    Type
                  </TableHead>
                  <TableHead className="py-2 text-xs font-medium text-[#4f473c]">
                    Clinical Significance
                  </TableHead>
                  <TableHead className="py-2 text-xs font-medium text-[#4f473c]">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {clinvarVariants.map((variant) => (
                  <TableRow
                    key={variant.clinvar_id}
                    className="border-b border-[4f473c]/10"
                  >
                    <TableCell className="py-2">
                      <div className="text-xs font-medium text-[#4f473c]/90">
                        {variant.title}
                      </div>
                      <div className="mt-1 flex items-center gap-1 text-xs text-[#4f473c]/70">
                        <p>Location: {variant.location}</p>
                        <Button
                          variant="link"
                          size="sm"
                          className="h-6 cursor-pointer px-0 text-xs text-[#de8246] hover:text-[#de8246]/80"
                          onClick={() =>
                            window.open(
                              `https://www.ncbi.nlm.nih.gov/clinvar/variation/${variant.clinvar_id}`,
                              "_blank",
                            )
                          }
                        >
                          View in ClinVar
                          <ExternalLink className="ml-1 inline-block h-2 w-2" />
                        </Button>
                      </div>
                    </TableCell>

                    <TableCell className="py-2 text-xs">
                      {variant.variation_type}
                    </TableCell>

                    <TableCell className="py-2 text-xs">
                      <div
                        className={`w-fit rounded-md px-2 py-1 text-center font-normal ${getClassificationColorClasses(variant.classification)}`}
                      >
                        {variant.classification || "Unknown"}
                      </div>
                      {variant.evo2Result && (
                        <div className="mt-2">
                          {" "}
                          <div
                            className={`flex w-fit items-center gap-1 rounded-md px-2 py-1 text-center ${getClassificationColorClasses(variant.evo2Result.prediction)}`}
                          >
                            <Shield className="h-3 w-3" />
                            <span>Evo2: {variant.evo2Result.prediction}</span>
                          </div>
                        </div>
                      )}
                    </TableCell>

                    <TableCell className="py-2 text-xs">
                      <div className="flex flex-col items-end gap-1">
                        {variant.variation_type.toLowerCase() ===
                        "single nucleotide variant" ? (
                          !variant.evo2Result ? (
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-7 cursor-pointer border-[#4f473c]/20 bg-[#e9eeea] px-3 text-xs text-[#4f473c] hover:bg-[#4f473c]/10"
                              disabled={variant.isAnalyzing}
                              // onClick={() => analyzeVariant()}
                            >
                              {variant.isAnalyzing ? (
                                <>
                                  <span className="mr-1 inline-block h-3 w-3 animate-spin rounded-full border-2 border-[#4f473c]/30 border-t-[#4f473c]">
                                    Analyzing...
                                  </span>
                                </>
                              ) : (
                                <>
                                  <TextCursorInput className="mr-1 inline-block h-3 w-3" />
                                  Analyze with Evo2
                                </>
                              )}
                            </Button>
                          ) : (
                            <Button className="h-7 cursor-pointer border-green-200 bg-green-50 px-3 text-xs text-green-700 hover:bg-green-100">
                              Compare Result
                            </Button>
                          )
                        ) : null}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <></>
        )}
      </CardContent>
    </Card>
  );
}
