"use client";

import { useCallback, useState } from "react";
import Campaigns from "@/components/campaigns";
import LaunchCampaign from "@/components/launch-campaign";

export default function CampaignWorkspaceSection() {
  const [refreshNonce, setRefreshNonce] = useState(0);
  const handleCampaignLaunched = useCallback(() => {
    setRefreshNonce((prev) => prev + 1);
  }, []);

  return (
    <section className="px-6 py-14 md:px-10 md:py-20">
      <div className="mx-auto w-full max-w-[var(--page-max-width)] flex flex-col gap-10">
        <div className="surface-card">
          <h2 className="section-heading mb-4">Active Campaigns</h2>
          <p className="mb-6 text-sm leading-6 text-[var(--color-charcoal)]/80">
            Browse current campaigns and inspect their goals and descriptions
            before deciding where to contribute.
          </p>
          <Campaigns refreshNonce={refreshNonce} />
        </div>

        <div className="surface-card">
          <h2 className="section-heading mb-4">Launch Campaign</h2>
          <p className="mb-6 text-sm leading-6 text-[var(--color-charcoal)]/80">
            Configure your fundraising goal and publish it to the contract. All
            write operations are signed directly from your wallet.
          </p>
          <LaunchCampaign onLaunched={handleCampaignLaunched} />
        </div>
      </div>
    </section>
  );
}
