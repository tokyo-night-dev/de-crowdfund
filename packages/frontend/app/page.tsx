import ConnectWallet from "@/components/connectWallet";

export default function Home() {
  return (
    <div>
      <main className="flex flex-col items-center gap-2">
        <p>Main Page</p>
        <ConnectWallet />
      </main>
    </div>
  );
}
