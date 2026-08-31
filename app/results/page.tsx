'use client';

import * as React from 'react';
import {
  ArrowRight,
  Check,
  ChevronDown,
  Landmark,
  X,
} from 'lucide-react';

import { cn } from '@/lib/utils';
import { SiteHeader } from '@/components/site-header';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Separator } from '@/components/ui/separator';

interface TraceItem {
  fieldName: string;
  humanLabel: string;
  passed: boolean;
  actual: string | number | (string | number)[];
  expected: string | number | (string | number)[];
  failCode?: string;
}

interface TraceJson {
  ungrouped: TraceItem[];
  groups: unknown[];
}

interface Recommendation {
  schemeVersionId: string;
  schemeId: string;
  schemeName: string;
  eligible: boolean;
  rank: number | null;
  rankScore: number | null;
  interestRatePct: number;
  amountRecommended: number | null;
  traceJson: TraceJson;
  rejectionReasons: string[];
}

const mockRecommendations: Recommendation[] = [
  {
    schemeVersionId: 'sv-1',
    schemeId: 's-1',
    schemeName: 'Micro Finance Scheme (MFS)',
    eligible: true,
    rank: 1,
    rankScore: 0.954,
    interestRatePct: 6.5,
    amountRecommended: 100000,
    traceJson: {
      ungrouped: [
        {
          fieldName: 'category',
          humanLabel:
            'Applicant belongs to the Scheduled Caste (SC) category',
          passed: true,
          actual: 'SC',
          expected: 'SC',
        },
        {
          fieldName: 'annual_income',
          humanLabel: 'Annual family income within the ₹5,00,000 ceiling',
          passed: true,
          actual: 350000,
          expected: 500000,
        },
        {
          fieldName: 'project_cost',
          humanLabel:
            "Project cost within this scheme's supported range (₹0 – ₹1,40,000)",
          passed: true,
          actual: 100000,
          expected: [0, 140000],
        },
      ],
      groups: [],
    },
    rejectionReasons: [],
  },
  {
    schemeVersionId: 'sv-3',
    schemeId: 's-3',
    schemeName: 'Aajeevika Micro-Finance Yojana',
    eligible: true,
    rank: 2,
    rankScore: 0.692,
    interestRatePct: 15,
    amountRecommended: 100000,
    traceJson: {
      ungrouped: [
        {
          fieldName: 'category',
          humanLabel:
            'Applicant belongs to the Scheduled Caste (SC) category',
          passed: true,
          actual: 'SC',
          expected: 'SC',
        },
        {
          fieldName: 'annual_income',
          humanLabel: 'Annual family income within the ₹5,00,000 ceiling',
          passed: true,
          actual: 350000,
          expected: 500000,
        },
        {
          fieldName: 'project_cost',
          humanLabel:
            "Project cost within this scheme's supported range (₹0 – ₹1,40,000)",
          passed: true,
          actual: 100000,
          expected: [0, 140000],
        },
      ],
      groups: [],
    },
    rejectionReasons: [],
  },
  {
    schemeVersionId: 'sv-2',
    schemeId: 's-2',
    schemeName: 'Term Loan Scheme',
    eligible: false,
    rank: null,
    rankScore: null,
    interestRatePct: 8,
    amountRecommended: null,
    traceJson: {
      ungrouped: [
        {
          fieldName: 'category',
          humanLabel:
            'Applicant belongs to the Scheduled Caste (SC) category',
          passed: true,
          actual: 'SC',
          expected: 'SC',
        },
        {
          fieldName: 'annual_income',
          humanLabel: 'Annual family income within the ₹5,00,000 ceiling',
          passed: true,
          actual: 350000,
          expected: 500000,
        },
        {
          fieldName: 'project_cost',
          humanLabel:
            "Project cost within this scheme's supported range (₹1,40,001 – ₹50,00,000)",
          passed: false,
          actual: 100000,
          expected: [140001, 5000000],
          failCode: 'FAILED',
        },
      ],
      groups: [],
    },
    rejectionReasons: [
      "Project cost within this scheme's supported range (₹1,40,001 – ₹50,00,000) not satisfied",
    ],
  },
];

const indianLocale = 'en-IN';

function formatRupees(amount: number): string {
  return new Intl.NumberFormat(indianLocale, {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatPercent(rate: number): string {
  return `${rate.toLocaleString(indianLocale, {
    minimumFractionDigits: 1,
    maximumFractionDigits: 2,
  })}% p.a.`;
}

export default function ResultsPage() {
  const eligible = mockRecommendations
    .filter((r) => r.eligible)
    .sort((a, b) => (a.rank ?? Infinity) - (b.rank ?? Infinity));
  const ineligible = mockRecommendations.filter((r) => !r.eligible);

  const handleSimulate = (schemeVersionId: string) => {
    console.log(schemeVersionId);
  };

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
        {/* Header section */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Your Matched Schemes
          </h1>
          <p className="mt-2 text-sm text-muted-foreground sm:text-base">
            Based on your profile, here are the NSFDC loan schemes you qualify
            for, ranked by how well they fit.
          </p>
        </div>

        {/* Eligible scheme cards */}
        <div className="space-y-4">
          {eligible.map((scheme) => {
            const isBestMatch = scheme.rank === 1;
            return (
              <Card
                key={scheme.schemeVersionId}
                className="relative overflow-hidden shadow-sm"
              >
                <CardHeader className="pb-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-secondary text-xs font-semibold text-secondary-foreground">
                          {scheme.rank}
                        </span>
                        <CardTitle className="text-lg leading-tight sm:text-xl">
                          {scheme.schemeName}
                        </CardTitle>
                      </div>
                    </div>
                    {isBestMatch && (
                      <Badge className="bg-primary text-primary-foreground">
                        Best Match
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Key figures */}
                  <div className="grid grid-cols-2 gap-4 rounded-md bg-muted/60 p-4">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        Interest rate
                      </p>
                      <p className="mt-1 text-lg font-semibold text-foreground">
                        {formatPercent(scheme.interestRatePct)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        Recommended amount
                      </p>
                      <p className="mt-1 text-lg font-semibold text-foreground">
                        {formatRupees(scheme.amountRecommended ?? 0)}
                      </p>
                    </div>
                  </div>

                  {/* Why this scheme? accordion */}
                  <Accordion type="single" collapsible>
                    <AccordionItem value="why" className="border-b-0">
                      <AccordionTrigger className="py-3 text-sm font-medium text-primary hover:no-underline">
                        Why this scheme?
                      </AccordionTrigger>
                      <AccordionContent>
                        <ul className="space-y-3 pt-1">
                          {scheme.traceJson.ungrouped.map((item) => (
                            <li
                              key={item.fieldName}
                              className="flex items-start gap-2.5"
                            >
                              <span
                                className={cn(
                                  'mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full',
                                  item.passed
                                    ? 'bg-success/15 text-success'
                                    : 'bg-destructive/15 text-destructive'
                                )}
                              >
                                {item.passed ? (
                                  <Check className="h-3 w-3" />
                                ) : (
                                  <X className="h-3 w-3" />
                                )}
                              </span>
                              <span className="text-sm text-foreground">
                                {item.humanLabel}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>

                  {/* Simulate button on best match */}
                  {isBestMatch && (
                    <div className="flex justify-end pt-1">
                      <Button
                        type="button"
                        onClick={() =>
                          handleSimulate(scheme.schemeVersionId)
                        }
                      >
                        Simulate my loan
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Ineligible schemes */}
        {ineligible.length > 0 && (
          <div className="mt-8">
            <Collapsible>
              <Card className="shadow-sm">
                <CollapsibleTrigger asChild>
                  <button
                    type="button"
                    className="flex w-full items-center justify-between p-6 text-left"
                  >
                    <div>
                      <CardTitle className="text-lg text-foreground">
                        Schemes you didn&apos;t qualify for
                      </CardTitle>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {ineligible.length} {ineligible.length === 1 ? 'scheme' : 'schemes'} not
                        matched to your profile
                      </p>
                    </div>
                    <ChevronDown className="h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-200 [[data-state=open]>&]:rotate-180" />
                  </button>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <Separator />
                  <div className="space-y-5 p-6">
                    {ineligible.map((scheme) => (
                      <div key={scheme.schemeVersionId} className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Landmark className="h-4 w-4 text-muted-foreground" />
                          <p className="font-medium text-foreground">
                            {scheme.schemeName}
                          </p>
                        </div>
                        <ul className="ml-6 space-y-1">
                          {scheme.rejectionReasons.map((reason, idx) => (
                            <li
                              key={idx}
                              className="list-disc text-sm text-muted-foreground"
                            >
                              {reason}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </CollapsibleContent>
              </Card>
            </Collapsible>
          </div>
        )}

        <p className="mt-8 text-center text-xs text-muted-foreground">
          NSFDC Scheme Finder — a platform for Scheduled Caste entrepreneurs
        </p>
      </main>
    </div>
  );
}
