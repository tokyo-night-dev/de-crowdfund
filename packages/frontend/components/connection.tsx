"use client";

import Image from "next/image";
import { useConnection, useDisconnect, useEnsAvatar, useEnsName } from "wagmi";

export default function Connection() {
  const { address } = useConnection();
  const { mutate: disconnect } = useDisconnect();
  const { data: ensName } = useEnsName({ address });
  const { data: ensAvatar } = useEnsAvatar({ name: ensName! });

  return (
    <div className="flex items-center gap-2 rounded-[var(--radius-button)] border border-[var(--color-paper-cream)]/30 bg-[var(--color-paper-cream)]/8 px-2 py-2">
      <div className="flex items-center gap-2 rounded-[8px] border border-[var(--color-paper-cream)]/25 bg-[var(--color-paper-cream)]/6 px-2 py-1.5">
        {ensAvatar ? (
          <Image
            alt="ENS Avatar"
            className="h-6 w-6 rounded-full border border-[var(--color-paper-cream)]/60 object-cover"
            src={ensAvatar}
            unoptimized
            width={24}
            height={24}
          />
        ) : (
          <div className="flex h-6 w-6 items-center justify-center rounded-full border border-[var(--color-paper-cream)]/45 text-[10px] font-semibold text-[var(--color-paper-cream)]/80">
            {address?.slice(0, 1).toUpperCase()}
          </div>
        )}
        <div className="flex flex-col">
          <div className="group relative w-fit">
            <p
              className="m-0 cursor-default text-[11px] font-medium tracking-[0.14em] text-[var(--color-paper-cream)]/70 uppercase"
              title={address ?? ""}
            >
              Connected
            </p>
            {address && (
              <span className="pointer-events-none absolute top-[calc(100%+6px)] left-0 z-10 hidden whitespace-nowrap rounded-md border border-[var(--color-paper-cream)]/35 bg-[var(--color-forest-ink)] px-2 py-1 text-[10px] text-[var(--color-paper-cream)] shadow-sm group-hover:block">
                {address}
              </span>
            )}
          </div>
        </div>
        <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-meadow)]" />
      </div>
      <button
        className="inline-flex items-center rounded-[var(--radius-button)] border border-[var(--color-paper-cream)]/45 bg-transparent px-3 py-2 text-xs font-semibold tracking-[0.08em] text-[var(--color-paper-cream)] uppercase transition hover:border-[var(--color-meadow)] hover:text-[var(--color-meadow)]"
        onClick={() => disconnect()}
      >
        Disconnect
      </button>
    </div>
  );
}
