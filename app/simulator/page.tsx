'use client';

import * as React from 'react';
import { ArrowLeft, IndianRupee, Info } from 'lucide-react';

import { cn } from '@/lib/utils';
import { SiteHeader } from '@/components/site-header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Slider } from '@/components/ui/slider';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

type MoratoriumType =
  | 'NONE'
  | 'INTEREST_ONLY'
  | 'CAPITALIZATION'
  | 'DEFERRED_PRINCIPAL';

type AffordabilityBand = 'GREEN' | 'AMBER' | 'RED';

interface ScheduleRow {
  month: number;
  openingPrincipal: number;
  interest: number;
  principalPaid: number;
  payment: number;
  closingPrincipal: number;
  phase: 'MORATORIUM' | 'REPAYMENT';
}

interface SimulationResult {
  emiAmount: number;
  totalInterest: number;
  totalPayable: number;
  schedule: ScheduleRow[];
}

interface SchemeContext {
  schemeName: string;
  interestRatePct: number;
  tenureMonths: number;
  moratoriumMonths: number;
  moratoriumType: MoratoriumType;
  loanMin: number;
  loanMax: number;
}

const mockSchemeContext: SchemeContext = {
  schemeName: 'Micro Finance Scheme (MFS)',
  interestRatePct: 6.5,
  tenureMonths: 36,
  moratoriumMonths: 3,
  moratoriumType: 'DEFERRED_PRINCIPAL',
  loanMin: 1,
  loanMax: 125000,
};

const mockSimulationResult: SimulationResult = {
  emiAmount: 3364,
  totalInterest: 11012,
  totalPayable: 111012,
  schedule: [
    {
      month: 1,
      openingPrincipal: 100000,
      interest: 541.67,
      principalPaid: 0,
      payment: 0,
      closingPrincipal: 100000,
      phase: 'MORATORIUM',
    },
    {
      month: 2,
      openingPrincipal: 100000,
      interest: 541.67,
      principalPaid: 0,
      payment: 0,
      closingPrincipal: 100000,
      phase: 'MORATORIUM',
    },
    {
      month: 3,
      openingPrincipal: 100000,
      interest: 541.67,
      principalPaid: 0,
      payment: 0,
      closingPrincipal: 100000,
      phase: 'MORATORIUM',
    },
    {
      month: 4,
      openingPrincipal: 101625.01,
      interest: 550.51,
      principalPaid: 2813.49,
      payment: 3364,
      closingPrincipal: 98811.52,
      phase: 'REPAYMENT',
    },
    {
      month: 5,
      openingPrincipal: 98811.52,
      interest: 535.24,
      principalPaid: 2828.76,
      payment: 3364,
      closingPrincipal: 95982.76,
      phase: 'REPAYMENT',
    },
    {
      month: 6,
      openingPrincipal: 95982.76,
      interest: 519.91,
      principalPaid: 2844.09,
      payment: 3364,
      closingPrincipal: 93138.67,
      phase: 'REPAYMENT',
    },
  ],
};

const mockAffordabilityBand: AffordabilityBand = 'GREEN';

const MORATORIUM_LABELS: Record<MoratoriumType, string> = {
  NONE: 'No moratorium — repayments begin immediately',
  INTEREST_ONLY:
    'Interest only — pay only interest during moratorium, principal unchanged',
  CAPITALIZATION:
    'Capitalization — no payments during moratorium, interest added to loan',
  DEFERRED_PRINCIPAL:
    'Deferred principal — no payments during moratorium, added to loan after',
};

const AFFORDABILITY_CONFIG: Record<
  AffordabilityBand,
  { label: string; className: string }
> = {
  GREEN: {
    label: 'Comfortable',
    className: 'bg-success/15 text-success',
  },
  AMBER: {
    label: 'Manageable',
    className: 'bg-warning/15 text-warning-foreground',
  },
  RED: {
    label: 'Tight',
    className: 'bg-destructive/15 text-destructive',
  },
};

const indianLocale = 'en-IN';

function formatRupees(amount: number): string {
  return new Intl.NumberFormat(indianLocale, {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(Math.round(amount));
}

function formatRupeesDecimal(amount: number): string {
  return new Intl.NumberFormat(indianLocale, {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export default function SimulatorPage() {
  const [principal, setPrincipal] = React.useState<number>(100000);
  const [isLoading, setIsLoading] = React.useState(false);
  const debounceRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const handlePrincipalChange = (value: number) => {
    setPrincipal(value);

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      console.log(value);
      setIsLoading(true);
      setTimeout(() => setIsLoading(false), 600);
    }, 500);
  };

  React.useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  const handleBack = () => {
    console.log('back-to-results');
  };

  const affordability = AFFORDABILITY_CONFIG[mockAffordabilityBand];
  const sliderMin = mockSchemeContext.loanMin;
  const sliderMax = mockSchemeContext.loanMax;

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
        {/* Header */}
        <div className="mb-6">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleBack}
            className="mb-4 -ml-2 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="mr-1.5 h-4 w-4" />
            Back to results
          </Button>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Loan Simulator
          </h1>
          <p className="mt-2 text-sm text-muted-foreground sm:text-base">
            {mockSchemeContext.schemeName} — adjust the loan amount to see how
            your repayments change.
          </p>
        </div>

        {/* Principal input + slider */}
        <Card className="mb-6 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Loan amount</CardTitle>
            <CardDescription>
              Choose an amount between {formatRupees(sliderMin)} and{' '}
              {formatRupees(sliderMax)}.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="principal">Principal amount</Label>
              <div className="relative">
                <IndianRupee className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="principal"
                  type="number"
                  min={sliderMin}
                  max={sliderMax}
                  inputMode="numeric"
                  value={principal}
                  onChange={(e) =>
                    handlePrincipalChange(Number(e.target.value) || 0)
                  }
                  className="pl-9"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Slider
                value={[principal]}
                min={sliderMin}
                max={sliderMax}
                step={1000}
                onValueChange={(value) => handlePrincipalChange(value[0])}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{formatRupees(sliderMin)}</span>
                <span>{formatRupees(sliderMax)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Loan terms */}
        <Card className="mb-6 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Loan terms</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Tenure
                </p>
                <p className="mt-1 text-base font-semibold text-foreground">
                  {mockSchemeContext.tenureMonths} months
                </p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Moratorium
                </p>
                <p className="mt-1 text-base font-semibold text-foreground">
                  {mockSchemeContext.moratoriumMonths} months
                </p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Interest rate
                </p>
                <p className="mt-1 text-base font-semibold text-foreground">
                  {mockSchemeContext.interestRatePct.toLocaleString(indianLocale, {
                    minimumFractionDigits: 1,
                    maximumFractionDigits: 2,
                  })}
                  % p.a.
                </p>
              </div>
            </div>
            <Separator className="my-4" />
            <div className="flex items-start gap-2.5 rounded-md bg-muted/60 p-3">
              <Info className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                {MORATORIUM_LABELS[mockSchemeContext.moratoriumType]}
              </p>
            </div>
          </CardContent>
        </Card>

        {isLoading ? (
          <ResultsSkeleton />
        ) : (
          <>
            {/* EMI display */}
            <Card className="mb-6 shadow-sm">
              <CardContent className="pt-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Monthly EMI
                    </p>
                    <p className="mt-1 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                      {formatRupees(mockSimulationResult.emiAmount)}
                    </p>
                  </div>
                  <Badge
                    className={cn(
                      'px-3 py-1 text-sm font-semibold',
                      affordability.className
                    )}
                  >
                    {affordability.label}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Summary card */}
            <Card className="mb-6 shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">Payment summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-md bg-muted/60 p-4">
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Total interest
                    </p>
                    <p className="mt-1 text-xl font-semibold text-foreground">
                      {formatRupees(mockSimulationResult.totalInterest)}
                    </p>
                  </div>
                  <div className="rounded-md bg-primary/5 p-4">
                    <p className="text-xs font-medium uppercase tracking-wide text-primary">
                      Total payable
                    </p>
                    <p className="mt-1 text-xl font-semibold text-primary">
                      {formatRupees(mockSimulationResult.totalPayable)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Repayment schedule */}
            <Card className="shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">Repayment schedule</CardTitle>
                <CardDescription>
                  Month-by-month breakdown of your loan repayment.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="max-h-[400px] overflow-auto rounded-md border">
                  <Table>
                    <TableHeader className="sticky top-0 z-10 bg-card">
                      <TableRow className="hover:bg-transparent">
                        <TableHead className="w-16">Month</TableHead>
                        <TableHead className="text-right">Opening</TableHead>
                        <TableHead className="text-right">Interest</TableHead>
                        <TableHead className="text-right">Principal</TableHead>
                        <TableHead className="text-right">Payment</TableHead>
                        <TableHead className="text-right">Closing</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockSimulationResult.schedule.map((row) => {
                        const isMoratorium = row.phase === 'MORATORIUM';
                        return (
                          <TableRow
                            key={row.month}
                            className={cn(
                              isMoratorium &&
                                'border-dashed bg-muted/40 hover:bg-muted/40'
                            )}
                          >
                            <TableCell className="font-medium">
                              <div className="flex items-center gap-2">
                                {row.month}
                                {isMoratorium && (
                                  <Badge
                                    variant="outline"
                                    className="border-dashed bg-transparent px-1.5 py-0 text-[10px] font-medium text-muted-foreground"
                                  >
                                    Moratorium
                                  </Badge>
                                )}
                              </div>
                            </TableCell>
                            <TableCell className="text-right tabular-nums text-muted-foreground">
                              {formatRupeesDecimal(row.openingPrincipal)}
                            </TableCell>
                            <TableCell className="text-right tabular-nums text-muted-foreground">
                              {formatRupeesDecimal(row.interest)}
                            </TableCell>
                            <TableCell className="text-right tabular-nums">
                              {formatRupeesDecimal(row.principalPaid)}
                            </TableCell>
                            <TableCell className="text-right tabular-nums font-medium">
                              {row.payment > 0
                                ? formatRupeesDecimal(row.payment)
                                : '—'}
                            </TableCell>
                            <TableCell className="text-right tabular-nums text-muted-foreground">
                              {formatRupeesDecimal(row.closingPrincipal)}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </>
        )}

        <p className="mt-8 text-center text-xs text-muted-foreground">
          NSFDC Scheme Finder — a platform for Scheduled Caste entrepreneurs
        </p>
      </main>
    </div>
  );
}

function ResultsSkeleton() {
  return (
    <>
      <Card className="mb-6 shadow-sm">
        <CardContent className="pt-6">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="mt-2 h-10 w-40" />
        </CardContent>
      </Card>
      <Card className="mb-6 shadow-sm">
        <CardHeader className="pb-4">
          <Skeleton className="h-5 w-32" />
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2">
            <Skeleton className="h-20 w-full rounded-md" />
            <Skeleton className="h-20 w-full rounded-md" />
          </div>
        </CardContent>
      </Card>
      <Card className="shadow-sm">
        <CardHeader className="pb-4">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="mt-1 h-4 w-64" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[400px] w-full rounded-md" />
        </CardContent>
      </Card>
    </>
  );
}
