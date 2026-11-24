
import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowLeftRight,
  Coins,
  CreditCard,
  LockKeyhole,
  Wallet,
} from "lucide-react";

import { PageTitle, Panel, Loadable, StatCard } from "@/components/app/ui";
import { CoinAvatar } from "@/components/common/CoinAvatar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/firebase/auth";
import { useAssets, usePriceMap } from "@/lib/data/hooks";
import {
  ASSET_SYMBOLS,
  assetName,
  formatAmount,
  unitPrice,
} from "@/lib/data/assets";
import { COINS } from "@/lib/coins";
import { formatUsd } from "@/lib/prices";
import { pageMeta } from "@/lib/seo";

export const Route = createFileRoute("/dashboard/")({
  head: () =>
    pageMeta("Dashboard", "Your PaymentHouse balances at a glance."),
  component: Overview,
});

function Overview() {
  const { user } = useAuth();
  const { data, loading, error } = useAssets(user?.uid);
  const { prices, loading: pricesLoading } = usePriceMap();

  const assets = data ?? [];
  const assetMap = new Map(assets.map((asset) => [asset.symbol, asset]));

  // Display all supported assets, including assets with zero balances.
  const supportedAssets = ASSET_SYMBOLS.map(
    (symbol) =>
      assetMap.get(symbol) ?? {
        symbol,
        balance: 0,
        locked: 0,
      },
  );

  // Preserve any additional assets returned by Firebase.
  const extraAssets = assets.filter(
    (asset) => !ASSET_SYMBOLS.includes(
      asset.symbol as (typeof ASSET_SYMBOLS)[number],
    ),
  );

  const allAssets = [...supportedAssets, ...extraAssets];

  const totalBalance = assets.reduce(
    (sum, asset) =>
      sum +
      (asset.balance + asset.locked) *
        unitPrice(asset.symbol, prices),
    0,
  );

  const availableBalance = assets.reduce(
    (sum, asset) =>
      sum + asset.balance * unitPrice(asset.symbol, prices),
    0,
  );

  const lockedBalance = assets.reduce(
    (sum, asset) =>
      sum + asset.locked * unitPrice(asset.symbol, prices),
    0,
  );

  const assetsHeld = assets.filter(
    (asset) => asset.balance + asset.locked > 0,
  ).length;

  return (
    <>
      <PageTitle
        title="Overview"
        description="Welcome to your PaymentHouse dashboard."
        actions={
          <Button asChild>
            <a href="/dashboard/convert">
              <ArrowLeftRight className="mr-2 h-4 w-4" />
              Convert
            </a>
          </Button>
        }
      />

      <Loadable loading={loading} error={error}>
        <div className="space-y-6">
          {/* Main balance cards */}
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              label="Total balance"
              value={formatUsd(totalBalance)}
              hint="Available and locked assets"
              icon={<Wallet className="h-5 w-5" />}
            />

            <StatCard
              label="Available balance"
              value={formatUsd(availableBalance)}
              hint="Your available holdings"
              icon={<Coins className="h-5 w-5" />}
            />

            <StatCard
              label="Locked balance"
              value={formatUsd(lockedBalance)}
              hint="Assets currently locked"
              icon={<LockKeyhole className="h-5 w-5" />}
            />

            <StatCard
              label="Assets held"
              value={assetsHeld}
              hint="Assets with a balance"
              icon={<CreditCard className="h-5 w-5" />}
            />
          </div>

          {/* Quick actions */}
          <Panel title="Quick actions">
            <div className="grid gap-3 sm:grid-cols-2">
              <a
                href="/dashboard/convert"
                className="flex items-center gap-4 rounded-xl border p-4 transition-colors hover:bg-accent"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <ArrowLeftRight className="h-5 w-5" />
                </span>

                <span className="min-w-0 flex-1">
                  <span className="block font-semibold">Convert assets</span>
                  <span className="text-sm text-muted-foreground">
                    Explore the conversion demo
                  </span>
                </span>
              </a>

              <a
                href="/dashboard/billing"
                className="flex items-center gap-4 rounded-xl border p-4 transition-colors hover:bg-accent"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <CreditCard className="h-5 w-5" />
                </span>

                <span className="min-w-0 flex-1">
                  <span className="block font-semibold">Billing</span>
                  <span className="text-sm text-muted-foreground">
                    View the billing demo
                  </span>
                </span>
              </a>
            </div>
          </Panel>

          {/* Asset list */}
          <Panel
            title="Your assets"
            action={
              <span className="text-sm text-muted-foreground">
                {COINS.length} supported cryptocurrencies
              </span>
            }
            bodyClassName="p-0"
          >
            {allAssets.length === 0 ? (
              <p className="p-5 text-sm text-muted-foreground">
                No supported assets available.
              </p>
            ) : (
              <div className="divide-y">
                {allAssets.map((asset) => {
                  const price = unitPrice(asset.symbol, prices);
                  const holdingValue =
                    (asset.balance + asset.locked) * price;

                  return (
                    <div
                      key={asset.symbol}
                      className="flex items-center gap-3 px-5 py-4"
                    >
                      <CoinAvatar symbol={asset.symbol} />

                      <div className="min-w-0 flex-1">
                        <p className="truncate font-semibold">
                          {assetName(asset.symbol)}
                        </p>

                        <p className="text-sm text-muted-foreground">
                          {formatAmount(asset.balance, asset.symbol)}
                          {asset.locked > 0 && (
                            <span className="ml-2">
                              + {formatAmount(asset.locked, asset.symbol)} locked
                            </span>
                          )}
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="font-semibold">
                          {formatUsd(holdingValue)}
                        </p>

                        {asset.locked > 0 && (
                          <p className="text-xs text-muted-foreground">
                            Includes locked assets
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Panel>

          {pricesLoading && (
            <p className="text-xs text-muted-foreground">
              Updating market prices…
            </p>
          )}
        </div>
      </Loadable>
    </>
  );
}
