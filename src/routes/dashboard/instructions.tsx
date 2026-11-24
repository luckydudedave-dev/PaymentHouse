
import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowLeft,
  CheckCircle2,
  Copy,
  FileImage,
  Info,
  ShieldAlert,
} from "lucide-react";
import { toast } from "sonner";

import { PageTitle, Panel } from "@/components/app/ui";
import { Button } from "@/components/ui/button";
import { formatUsd } from "@/lib/prices";
import { pageMeta } from "@/lib/seo";

const DEMO_ETH_ADDRESS = "ETH-ADDRESS-FOR-DEMO-ONLY";

export const Route = createFileRoute("/dashboard/instructions")({
  validateSearch: (search: Record<string, unknown>) => ({
    amount: typeof search.amount === "string" ? search.amount : "1",
    estimate:
      typeof search.estimate === "string" ? search.estimate : "0",
  }),
  head: () =>
    pageMeta(
      "Conversion Instructions",
      "PaymentHouse conversion demonstration instructions.",
    ),
  component: InstructionsPage,
});

function InstructionsPage() {
  const { amount, estimate } = Route.useSearch();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const amountNumber = Number(amount);
  const estimateNumber = Number(estimate);

  const validAmount =
    Number.isFinite(amountNumber) && amountNumber > 0;

  const validEstimate =
    Number.isFinite(estimateNumber) && estimateNumber >= 0;

  async function copyDemoAddress() {
    try {
      await navigator.clipboard.writeText(DEMO_ETH_ADDRESS);
      toast.success("Demo placeholder copied");
    } catch {
      toast.error("Could not copy the placeholder");
    }
  }

  function submitDemoRequest() {
    if (!selectedFile) {
      toast.error("Please select a sample file first.");
      return;
    }

    setSubmitted(true);
    toast.success("Demo request submitted successfully.");
  }

  return (
    <>
      <PageTitle
        title="Conversion Instructions"
        description="Review the details of your Ethereum to USD conversion."
        actions={
          <Button variant="outline" asChild>
            <a href="/dashboard/convert">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </a>
          </Button>
        }
      />

      <div className="mx-auto max-w-3xl space-y-6">
        <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-4">
          <div className="flex gap-3">
            <Info className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />
            <div>
              <h2 className="font-semibold">How this demo works</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                This page demonstrates the steps of a conversion request.
                No real cryptocurrency payment is accepted, and no funds
                or account balances are changed.
              </p>
            </div>
          </div>
        </div>

        <Panel title="Your conversion summary">
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm text-muted-foreground">
                  Conversion from
                </p>
                <p className="text-lg font-semibold">Ethereum (ETH)</p>
              </div>

              <div className="text-right">
                <p className="text-sm text-muted-foreground">
                  Conversion to
                </p>
                <p className="text-lg font-semibold">US Dollar (USD)</p>
              </div>
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between gap-4">
                <span className="text-sm text-muted-foreground">
                  ETH amount
                </span>
                <span className="font-semibold">
                  {validAmount ? `${amountNumber} ETH` : "Invalid amount"}
                </span>
              </div>

              <div className="mt-3 flex justify-between gap-4">
                <span className="text-sm text-muted-foreground">
                  Estimated USD value
                </span>
                <span className="font-bold">
                  {validEstimate
                    ? formatUsd(estimateNumber)
                    : "Unavailable"}
                </span>
              </div>
            </div>
          </div>
        </Panel>

        <Panel title="Ethereum address demonstration">
          <div className="space-y-4">
            <div className="flex items-start gap-3 rounded-xl border border-amber-500/30 bg-amber-500/5 p-4">
              <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
              <div>
                <p className="font-semibold text-amber-700">
                  Demo only — not a payment address
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  The text below is a fictional placeholder. Do not send
                  cryptocurrency to it. No real payment address is provided.
                </p>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Ethereum address placeholder
              </label>

              <div className="flex flex-col gap-2 sm:flex-row">
                <div className="flex min-h-12 flex-1 items-center break-all rounded-lg border bg-muted/40 px-3 py-2 font-mono text-sm">
                  {DEMO_ETH_ADDRESS}
                </div>

                <Button
                  type="button"
                  variant="outline"
                  onClick={copyDemoAddress}
                >
                  <Copy className="mr-2 h-4 w-4" />
                  Copy
                </Button>
              </div>
            </div>
          </div>
        </Panel>

        <Panel title="Sample receipt selection">
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Select an image or PDF from your device to test the receipt
              selection interface. This file will remain local and will
              not be uploaded or verified.
            </p>

            <label
              htmlFor="demo-receipt"
              className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 text-center transition-colors hover:bg-accent"
            >
              <FileImage className="mb-3 h-10 w-10 text-muted-foreground" />

              <span className="font-semibold">
                Choose a sample file
              </span>

              <span className="mt-1 text-xs text-muted-foreground">
                PNG, JPG or PDF
              </span>

              <input
                id="demo-receipt"
                type="file"
                accept="image/png,image/jpeg,application/pdf"
                className="sr-only"
                onChange={(event) => {
                  setSelectedFile(event.target.files?.[0] ?? null);
                  setSubmitted(false);
                }}
              />
            </label>

            {selectedFile && (
              <div className="flex items-center gap-3 rounded-lg border p-3">
                <FileImage className="h-5 w-5 text-primary" />

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">
                    {selectedFile.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {(selectedFile.size / 1024).toFixed(1)} KB
                  </p>
                </div>

                <CheckCircle2 className="h-5 w-5 text-green-600" />
              </div>
            )}

            <Button
              type="button"
              className="h-12 w-full"
              disabled={!selectedFile || submitted || !validAmount}
              onClick={submitDemoRequest}
            >
              {submitted ? "Demo request submitted" : "Submit demo request"}
            </Button>

            {submitted && (
              <div className="rounded-xl border border-green-500/20 bg-green-500/5 p-4 text-sm">
                <p className="font-semibold text-green-700">
                  Demo submission successful
                </p>
                <p className="mt-1 text-muted-foreground">
                  Your sample request has been simulated. It has not been
                  sent to an administrator, and no balance has changed.
                </p>
              </div>
            )}
          </div>
        </Panel>
      </div>
    </>
  );
}
