"use client";

import ConnectWallet from "@/components/connectWallet";

export default function TopNavigation() {
  return (
    <header className="sticky top-0 z-20 border-b border-[var(--color-paper-cream)]/20 bg-[var(--color-forest-ink)]/95 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-[var(--page-max-width)] items-center justify-between gap-6 px-6 md:px-10">
        <div className="flex items-center gap-3">
          <div className="h-2.5 w-2.5 rounded-full bg-[var(--color-meadow)]" />
          <p className="m-0 text-lg font-semibold tracking-tight text-[var(--color-paper-cream)] whitespace-nowrap">
            De-Crowdfund
          </p>
        </div>

        <div className="flex items-center gap-2">
          <ConnectWallet />
        </div>
      </div>
    </header>
  );
}
