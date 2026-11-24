
import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowDown,
  ArrowLeftRight,
  ArrowRight,
  Info,
} from "lucide-react";

import { PageTitle, Panel } from "@/components/app/ui";
import { Button } from "@/components/ui/button";
import { usePriceMap } from "@/lib/data/hooks";
import { formatUsd } from "@/lib/prices";
import { pageMeta } from "@/lib/seo";

export const Route = createFileRoute("/dashboard/convert")({
  head: () =>
    pageMeta("Convert Ethereum to USD", "PaymentHouse conversion demo."),
  component: ConvertPage,
});

function ConvertPage() {
  const [amount, setAmount] = useState("1");
  const { prices, loading } = usePriceMap();

  const ethPrice = prices.ETH ?? 0;
  const numericAmount = Number(amount);
  const validAmount =
    amount.trim() !== "" &&
    Number.isFinite(numericAmount) &&
    numericAmount > 0;

  const estimatedUsd = validAmount ? numericAmount * ethPrice : 0;

 const continueUrl =
  `/dashboard/instructions?amount=${encodeURIComponent(amount)}` +
  `&estimate=${encodeURIComponent(String(estimatedUsd))}`;

  return (
    <>
      <PageTitle
        title="Convert Assets"
        description="Explore the Ethereum to US Dollar conversion process."
      />

      <div className="mx-auto max-w-2xl space-y-6">
        <Panel title="Select conversion">
          <div className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium">
                You convert
              </label>

              <div className="flex items-center gap-3 rounded-xl border p-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-purple-100 font-bold text-purple-700">
                  Ξ
                </div>

                <div className="min-w-0 flex-1">
                  <p className="font-semibold">Ethereum</p>
                  <p className="text-sm text-muted-foreground">ETH</p>
                </div>

                <span className="rounded-lg bg-muted px-3 py-2 text-sm font-medium">
                  ETH
                </span>
              </div>

              <label
                htmlFor="eth-amount"
                className="mb-2 mt-4 block text-sm font-medium"
              >
                Amount in ETH
              </label>

              <input
                id="eth-amount"
                type="number"
                min="0"
                step="any"
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
                placeholder="Enter ETH amount"
                className="h-12 w-full rounded-xl border bg-background px-4 text-lg outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="flex justify-center">
              <span className="flex h-10 w-10 items-center justify-center rounded-full border bg-muted">
                <ArrowDown className="h-5 w-5" />
              </span>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                You receive (estimated)
              </label>

              <div className="flex items-center gap-3 rounded-xl border p-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-green-100 font-bold text-green-700">
                  $
                </div>

                <div className="min-w-0 flex-1">
                  <p className="font-semibold">US Dollar</p>
                  <p className="text-sm text-muted-foreground">USD</p>
                </div>

                <span className="rounded-lg bg-muted px-3 py-2 text-sm font-medium">
                  USD
                </span>
              </div>

              <div className="mt-4 rounded-xl bg-muted/60 p-4">
                <p className="text-sm text-muted-foreground">
                  Estimated conversion value
                </p>

                <p className="mt-1 text-2xl font-bold">
                  {validAmount ? formatUsd(estimatedUsd) : "$0.00"}
                </p>
              </div>
            </div>
          </div>
        </Panel>

        <Panel title="Conversion information">
          <div className="space-y-3 text-sm">
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">Conversion pair</span>
              <span className="font-medium">ETH → USD</span>
            </div>

            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">ETH market price</span>
              <span className="font-medium">
                {loading
                  ? "Loading price..."
                  : ethPrice > 0
                    ? formatUsd(ethPrice)
                    : "Price unavailable"}
              </span>
            </div>

            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">Conversion type</span>
              <span className="font-medium">Demo only</span>
            </div>
          </div>
        </Panel>

        <div className="flex items-start gap-3 rounded-xl border border-blue-500/20 bg-blue-500/5 p-4 text-sm">
          <Info className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />
          <p className="text-muted-foreground">
            This is a demonstration of the PaymentHouse conversion process.
            The displayed amount is an estimate, not a guaranteed exchange
            rate. No cryptocurrency or money will be transferred.
          </p>
        </div>

        <Button
          asChild
          className="h-12 w-full"
          disabled={!validAmount || ethPrice <= 0}
        >
          <a href={continueUrl}>
            Continue
            <ArrowRight className="ml-2 h-4 w-4" />
          </a>
        </Button>
      </div>
    </>
  );
}
