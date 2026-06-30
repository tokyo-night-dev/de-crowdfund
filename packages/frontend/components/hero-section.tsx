const metrics = [
  {
    label: "Network",
    value: process.env.NEXT_PUBLIC_NETWORK ?? "Anvil",
    featured: true,
  },
  {
    label: "Transparency",
    value: "Onchain Data",
    featured: true,
  },
  { label: "Model", value: "Milestone Funding", featured: false },
  { label: "Settlement", value: "Smart Contract", featured: false },
];

export default function HeroSection() {
  return (
    <section className="bg-[var(--color-forest-ink)]">
      <div className="px-6 pt-14 pb-20 md:px-10 md:pt-20 md:pb-24">
        <div className="mx-auto flex w-full max-w-[var(--page-max-width)] flex-col gap-12">
          <div className="max-w-3xl">
            <h1 className="display-heading">
              Funding Campaigns
              <br />
              <span className="text-[var(--color-meadow)]">Onchain</span>
            </h1>
            <p className="mt-5 max-w-2xl text-base text-[var(--color-paper-cream)]/85">
              Build transparent campaigns, collect support securely, and operate
              your fundraising flow with wallet-native ownership.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {metrics.map((metric) => (
              <div
                className={`hero-metric-card ${metric.featured ? "hero-metric-card-featured" : ""}`}
                key={metric.label}
              >
                <p className="hero-metric-label">{metric.label}</p>
                <p className="hero-metric-value">{metric.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
