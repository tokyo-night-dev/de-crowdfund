"use client";

import { useEffect, useState } from "react";
import { useReadContract } from "wagmi";
import { abi } from "@/abi/abi";

interface CampaignsProps {
  refreshNonce?: number;
}

export default function Campaigns({ refreshNonce }: CampaignsProps) {
  const [nowInSec, setNowInSec] = useState(() => Math.floor(Date.now() / 1000));
  const {
    data: campaigns,
    isLoading,
    refetch,
  } = useReadContract({
    abi,
    address: (process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`) ?? "",
    functionName: "getAllCampaigns",
  });

  type CampaignItem = NonNullable<typeof campaigns>[number];
  function checkIsCampaignEnded(campaign: CampaignItem) {
    const deadline =
      campaign.deadLine !== undefined && campaign.deadLine !== null
        ? BigInt(campaign.deadLine)
        : null;

    if (!deadline) return false;
    return deadline < BigInt(nowInSec);
  }

  function formatCampaignDeadline(campaign: CampaignItem) {
    const deadlineInSec = Number(campaign.deadLine ?? 0);
    if (!Number.isFinite(deadlineInSec) || deadlineInSec <= 0) return "Unknown";
    return new Date(deadlineInSec * 1000).toLocaleString();
  }

  useEffect(() => {
    if (refreshNonce === undefined) return;
    refetch();
  }, [refreshNonce, refetch]);

  useEffect(() => {
    const timer = setInterval(() => {
      setNowInSec(Math.floor(Date.now() / 1000));
    }, 30000);

    return () => clearInterval(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="rounded-[var(--radius-card)] border border-[var(--color-frost)] bg-white/40 p-5 text-sm text-[var(--color-moss-gray)]">
        Loading campaigns...
      </div>
    );
  }

  return (
    <ul className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {campaigns?.map((campaign, idx) => {
        const isEnded = checkIsCampaignEnded(campaign);
        return (
          <li
            className="group transition relative rounded-[var(--radius-card)] border border-[var(--color-sage-border)] bg-gradient-to-br from-[var(--color-paper-cream)]/95 to-[var(--color-frost)]/70 p-6 overflow-hidden"
            key={`${idx} - ${campaign.creator}`}
          >
            <div className="absolute top-4 right-4 flex items-center gap-2">
              <span className="rounded-full bg-white/60 backdrop-blur px-3 py-1 text-[10px] text-[var(--color-moss-green)] font-semibold shadow-sm border border-[var(--color-moss-green)]">
                #{idx + 1}
              </span>
              <span
                className={`rounded-full px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] ${
                  isEnded
                    ? "bg-red-100 text-red-700"
                    : "bg-[var(--color-meadow)]/20 text-[var(--color-forest-ink)]"
                }`}
              >
                {isEnded ? "Ended" : "Active"}
              </span>
            </div>
            <h3 className="mb-2 text-xl font-bold text-[var(--color-forest-ink)] leading-tight tracking-tight line-clamp-1">
              {campaign.title}
            </h3>
            <p className="text-[13px] mb-3 text-[var(--color-charcoal)] line-clamp-3 font-medium">
              {campaign.description}
            </p>
            <div className="flex flex-col gap-3 mb-3">
              <div className="flex items-center gap-2">
                <span className="w-16 shrink-0 text-[11px] font-medium text-[var(--color-moss-gray)]">
                  Target
                </span>
                <span className="text-sm font-semibold text-[var(--color-moss-green)]">
                  {campaign.targetAmount?.toString?.() ?? campaign.targetAmount}{" "}
                  ETH
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-16 shrink-0 text-[11px] font-medium text-[var(--color-moss-gray)]">
                  Raised
                </span>
                <span className="text-sm font-semibold text-[var(--color-forest-ink)]">
                  {campaign.currentAmount?.toString?.() ??
                    campaign.currentAmount}{" "}
                  ETH
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-16 shrink-0 text-[11px] font-medium text-[var(--color-moss-gray)]">
                  Deadline
                </span>
                <span className="text-xs font-semibold text-[var(--color-charcoal)]">
                  {formatCampaignDeadline(campaign)}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-[10px] text-[var(--color-moss-gray)]">
                creator
              </span>
              <div className="rounded-full bg-[var(--color-moss-green)]/10 px-2 py-1 text-[10px] font-semibold text-[var(--color-moss-green)] truncate max-w-[70%]">
                {campaign.creator}
              </div>
            </div>
            <div className="absolute left-0 right-0 bottom-0 h-1 bg-gradient-to-r from-[var(--color-moss-green)]/90 via-[var(--color-lemon)]/40 to-[var(--color-frost)]/10 transition-all"></div>
          </li>
        );
      })}

      {campaigns?.length === 0 && (
        <li className="rounded-[var(--radius-card)] border border-dashed border-[var(--color-sage-border)] p-5 text-sm text-[var(--color-moss-gray)]">
          No campaigns yet.
        </li>
      )}
    </ul>
  );
}
