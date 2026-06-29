"use client";

import { Connector, useConnect, useConnectors } from "wagmi";

export default function WalletOptions() {
  const { mutate: connect } = useConnect();
  const connectors = useConnectors();

  return connectors.map((connector) => (
    <button key={connector.uid} onClick={() => connect({ connector })}>
      {connector.name}
    </button>
  ));
}
