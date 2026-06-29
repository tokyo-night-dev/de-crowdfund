"use client";

import { useConnection, useDisconnect, useEnsAvatar, useEnsName } from "wagmi";

export default function Connection() {
  const { address } = useConnection();
  const { mutate: disconnect } = useDisconnect();
  const { data: ensName } = useEnsName({ address });
  const { data: ensAvatar } = useEnsAvatar({ name: ensName! });

  return (
    <div>
      {ensAvatar && <img alt="ENS Avatar" src={ensAvatar} />}
      {address && <div>{ensName ? `${ensName} (${address})` : address}</div>}
      <button onClick={() => disconnect()}>DisConnect</button>
    </div>
  );
}
