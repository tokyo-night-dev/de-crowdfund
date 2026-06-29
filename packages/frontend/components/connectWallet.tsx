"use client";

import { useConnection } from "wagmi";
import Connection from "./connection";
import WalletOptions from "./wallet-options";

export default function ConnectWallet() {
  const { isConnected } = useConnection();

  if (isConnected) return <Connection />;
  return <WalletOptions />;
}
