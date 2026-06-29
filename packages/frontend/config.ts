import { metaMask } from "@wagmi/connectors";
import { createConfig, http, injected } from "@wagmi/core";
import { sepolia, anvil } from "viem/chains";

const DEFAULT_ANVIL_RPC_URL = "http://127.0.0.1:8545";

export const config = createConfig({
  chains: [sepolia, anvil],
  connectors: [injected()],
  ssr: true,
  transports: {
    [sepolia.id]: http(),
    [anvil.id]: http(DEFAULT_ANVIL_RPC_URL),
  },
});
