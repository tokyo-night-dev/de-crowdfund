import CampaignWorkspaceSection from "@/components/campaign-workspace-section";
import HeroSection from "@/components/hero-section";
import TopNavigation from "@/components/top-navigation";

export default function Home() {
  return (
    <div className="min-h-screen">
      <main>
        <TopNavigation />
        <HeroSection />
        <CampaignWorkspaceSection />
      </main>
    </div>
  );
}
