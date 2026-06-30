"use client";

import { useConnect, useConnectors } from "wagmi";

export default function WalletOptions() {
  const { mutate: connect } = useConnect();
  const connectors = useConnectors();

  return (
    <div className="flex items-center gap-2 rounded-[var(--radius-button)] border border-[var(--color-paper-cream)]/30 bg-[var(--color-paper-cream)]/8 px-2 py-2">
      {connectors.map((connector) => (
        <button
          className="inline-flex items-center gap-2 rounded-[var(--radius-button)] border border-[var(--color-paper-cream)]/45 bg-transparent px-3 py-2 text-xs font-semibold tracking-[0.08em] text-[var(--color-paper-cream)] uppercase transition hover:border-[var(--color-meadow)] hover:text-[var(--color-meadow)]"
          key={connector.uid}
          onClick={() => connect({ connector })}
        >
          <span
            aria-hidden
            className="h-1.5 w-1.5 rounded-full bg-[var(--color-meadow)]"
          />
          {connector.name}
        </button>
      ))}
    </div>
  );
}
