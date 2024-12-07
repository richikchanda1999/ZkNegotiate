import { createConfig, http, cookieStorage, createStorage, injected } from "wagmi";
import { mainnet, sepolia, polygonZkEvm } from "wagmi/chains";
import { metaMask, safe } from "wagmi/connectors";

export function getConfig() {
  return createConfig({
    chains: [mainnet, sepolia, polygonZkEvm],
    ssr: true,
    storage: createStorage({
      storage: cookieStorage,
    }),
    connectors: [
      injected(),
      metaMask(),
      safe(),
    ],
    transports: {
      [mainnet.id]: http(),
      [sepolia.id]: http(),
      [polygonZkEvm.id]: http()
    },
  });
}
