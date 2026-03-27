// Käytetään 'type' -avainsanaa RoadmapItemin kohdalla
import {
  PATCH_NOTES,
  FAQ_DATA,
  ROADMAP_DATA,
  type RoadmapItem, // TÄMÄ ON KORJAUS
} from "../../data/metaData";

// --- GENERIC CONTAINER ---
// Poistettu vilkkuva neliö ja raskaat animaatiot.
const MetaContainer = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div className="p-6 md:p-10 max-w-3xl mx-auto space-y-8 animate-in fade-in duration-300 text-left">
    <div className="border-b border-border pb-4">
      <h2 className="text-2xl font-bold uppercase tracking-wider text-tx-main">
        {title}
      </h2>
    </div>
    <div className="space-y-6">{children}</div>
  </div>
);

// --- PATCH NOTES ---
export const PatchNotesView = () => (
  <MetaContainer title="Update Logs">
    {PATCH_NOTES.map((patch) => (
      <div
        key={patch.version}
        className="bg-panel/5 border border-border/50 p-6 rounded-lg"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-baseline gap-3">
            <span className="text-xl font-bold text-tx-main">
              v{patch.version}
            </span>
            <span className="text-[10px] font-bold text-tx-muted uppercase tracking-widest">
              {patch.date}
            </span>
          </div>
          {patch.isMajor && (
            <span className="bg-tx-main text-app-base text-[9px] font-bold px-2 py-0.5 rounded uppercase">
              Major
            </span>
          )}
        </div>
        <ul className="space-y-2">
          {patch.changes.map((change, i) => (
            <li key={i} className="text-sm text-tx-muted flex gap-3">
              <span className="text-border font-bold">•</span> {change}
            </li>
          ))}
        </ul>
      </div>
    ))}
  </MetaContainer>
);

// --- FAQ ---
export const FaqView = () => (
  <MetaContainer title="Knowledge Base">
    {FAQ_DATA.map((faq, i) => (
      <div
        key={i}
        className="space-y-2 border-b border-border/20 pb-4 last:border-0"
      >
        <h3 className="text-tx-main font-bold text-sm uppercase tracking-tight">
          Q: {faq.question}
        </h3>
        <div className="text-tx-muted text-sm leading-relaxed pl-5">
          {faq.answer}
        </div>
      </div>
    ))}
  </MetaContainer>
);

// --- ROADMAP VIEW ---
export const RoadmapView = () => (
  <MetaContainer title="Development Roadmap">
    <div className="space-y-4">
      <p className="text-tx-muted text-sm mb-6 border-l-2 border-border pl-4">
        The following objectives outline the future of Nexus Idle. Statuses
        represent current internal progress.
      </p>

      {/* 2. Lisää item-parametrille tyyppi : RoadmapItem */}
      {ROADMAP_DATA.map((item: RoadmapItem) => (
        <div
          key={item.id}
          className="bg-panel/10 border border-border p-6 rounded-lg"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-3">
            <h3 className="text-lg font-bold text-tx-main uppercase tracking-tight">
              {item.title}
            </h3>

            <div className="flex items-center gap-3">
              {item.eta && (
                <span className="text-[10px] font-mono text-tx-muted uppercase">
                  Target: {item.eta}
                </span>
              )}
              <span
                className={`
                text-[9px] font-bold px-2 py-1 rounded uppercase tracking-tighter
                ${
                  item.status === "Live"
                    ? "bg-success/20 text-success"
                    : item.status === "Testing"
                      ? "bg-accent/20 text-accent"
                      : item.status === "In Development"
                        ? "bg-warning/20 text-warning"
                        : "bg-border text-tx-muted"
                }
              `}
              >
                {item.status}
              </span>
            </div>
          </div>

          <p className="text-tx-muted text-sm leading-relaxed max-w-2xl">
            {item.description}
          </p>
        </div>
      ))}
    </div>
  </MetaContainer>
);

// --- PRIVACY POLICY VIEW ---
export const PrivacyPolicyView = () => (
  <MetaContainer title="Privacy Policy">
    <div className="prose prose-invert max-w-none font-sans text-sm leading-relaxed text-tx-muted space-y-8">
      <section>
        <p className="text-[10px] font-bold text-tx-muted uppercase tracking-widest mb-2">
          Effective Date: March 4, 2026
        </p>
        <p>
          Nexus Idle is committed to protecting the privacy of its users. This
          Privacy Policy describes how we collect, use, and handle game data, as
          well as your rights regarding this information under the General Data
          Protection Regulation (GDPR).
        </p>
      </section>

      <section className="space-y-3">
        <h3 className="text-tx-main font-bold uppercase tracking-wider text-sm border-b border-border pb-2">
          1. Data Collection and Use
        </h3>
        <p>
          Nexus Idle is a local-first application. Progress is primarily stored
          locally. We use Google Firebase to synchronize state across devices.
        </p>
        <p>
          The data collected is strictly limited to information necessary for
          functionality:
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li>
            <span className="text-tx-main font-semibold">Game State:</span>{" "}
            Stats, inventory, and achievements.
          </li>
          <li>
            <span className="text-tx-main font-semibold">User Identifier:</span>{" "}
            Anonymous UID for account linking.
          </li>
          <li>
            <span className="text-tx-main font-semibold">Timestamps:</span>{" "}
            Required for offline progress calculations.
          </li>
        </ul>
      </section>

      <section className="space-y-3">
        <h3 className="text-tx-main font-bold uppercase tracking-wider text-sm border-b border-border pb-2">
          2. Data Sharing and Third Parties
        </h3>
        <p>
          Your privacy is our priority. We do not sell, rent, or trade your game
          data to third parties. Data is processed solely through Google
          Firebase's secure servers.
        </p>
      </section>

      <section className="space-y-3">
        <h3 className="text-tx-main font-bold uppercase tracking-wider text-sm border-b border-border pb-2">
          3. GDPR and Your Rights
        </h3>
        <div className="space-y-4 pt-1">
          <div>
            <p className="text-tx-main font-bold text-[10px] uppercase underline underline-offset-4 decoration-border mb-1">
              Right to Erasure
            </p>
            <p>
              You have the right to delete your account and all associated data
              through the in-game settings. Upon deletion, data is permanently
              removed from our databases.
            </p>
          </div>
          <div>
            <p className="text-tx-main font-bold text-[10px] uppercase underline underline-offset-4 decoration-border mb-1">
              Data Access
            </p>
            <p>
              Since all data is visible within the game interface, you have
              constant access to your stored information.
            </p>
          </div>
        </div>
      </section>

      <section className="space-y-3">
        <h3 className="text-tx-main font-bold uppercase tracking-wider text-sm border-b border-border pb-2">
          4. Payment Processing
        </h3>
        <p>
          For users on non-Steam platforms, all financial transactions are
          processed exclusively through Stripe.
        </p>
        <p>
          Nexus Idle does not store or access your sensitive financial
          information. All payment data is handled by Stripe in accordance with
          PCI-DSS security standards.
        </p>
      </section>

      <section className="space-y-6">
        <div className="space-y-2">
          <h4 className="text-tx-main font-bold uppercase text-[11px] tracking-widest">
            5. Local Storage and Cookies
          </h4>
          <p>
            The game utilizes LocalStorage to maintain progress during sessions.
            No marketing cookies are used.
          </p>
        </div>

        <div className="space-y-2">
          <h4 className="text-tx-main font-bold uppercase text-[11px] tracking-widest">
            6. Contact Information
          </h4>
          <p>
            For inquiries regarding this Privacy Policy, please contact
            administration through official community channels.
          </p>
        </div>
      </section>

      <div className="pt-8 border-t border-border/30">
        <p className="text-center text-[10px] uppercase tracking-[0.2em] font-bold opacity-40">
          Nexus Idle — Professional System Standards
        </p>
      </div>
    </div>
  </MetaContainer>
);

// --- SIMPLE TEXT VIEW ---
export const SimpleTextView = ({
  title,
  content,
}: {
  title: string;
  content: string;
}) => (
  <MetaContainer title={title}>
    <div className="bg-panel/10 p-8 rounded-lg border border-border text-tx-muted leading-relaxed text-sm whitespace-pre-wrap">
      {content}
    </div>
  </MetaContainer>
);
