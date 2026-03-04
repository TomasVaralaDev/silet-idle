import {
  ANNOUNCEMENTS,
  PATCH_NOTES,
  FAQ_DATA,
  GUIDE_DATA,
  PRIVACY_POLICY_TEXT,
} from "../../data/metaData";

// --- GENERIC CONTAINER ---
const MetaContainer = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div className="p-6 md:p-10 max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
    <h2 className="text-3xl font-black uppercase tracking-[0.2em] text-tx-main border-b-2 border-accent pb-4 flex justify-between items-center">
      {title}
      <span className="w-2 h-2 bg-accent animate-pulse"></span>
    </h2>
    <div className="space-y-6">{children}</div>
  </div>
);

// --- ANNOUNCEMENTS ---
export const AnnouncementsView = () => (
  <MetaContainer title="System Feed">
    {ANNOUNCEMENTS.map((ann) => (
      <div
        key={ann.id}
        className="bg-panel/40 border-l-4 border-accent p-6 rounded-r-xl"
      >
        <div className="flex justify-between text-[10px] font-mono text-accent mb-2 uppercase tracking-widest">
          <span>Official Broadcast</span>
          <span>{ann.date}</span>
        </div>
        <h3 className="text-xl font-bold text-tx-main mb-2 uppercase italic">
          {ann.title}
        </h3>
        <p className="text-tx-muted leading-relaxed text-sm">{ann.content}</p>
      </div>
    ))}
  </MetaContainer>
);

// --- PATCH NOTES ---
export const PatchNotesView = () => (
  <MetaContainer title="Update Logs">
    {PATCH_NOTES.map((patch) => (
      <div
        key={patch.version}
        className="bg-panel/20 border border-border/50 p-6 rounded-xl relative overflow-hidden group hover:border-accent/30 transition-colors"
      >
        {patch.isMajor && (
          <div className="absolute top-0 right-0 bg-accent text-black text-[9px] font-black px-3 py-1 uppercase tracking-tighter">
            Major Update
          </div>
        )}
        <div className="flex items-baseline gap-4 mb-4">
          <span className="text-2xl font-mono font-black text-tx-main">
            {patch.version}
          </span>
          <span className="text-xs font-bold text-tx-muted uppercase tracking-widest">
            {patch.date}
          </span>
        </div>
        <ul className="space-y-3">
          {patch.changes.map((change, i) => (
            <li key={i} className="text-sm text-tx-muted flex gap-3">
              <span className="text-accent font-bold mt-0.5">_</span> {change}
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
      <div key={i} className="space-y-2 group">
        <h3 className="text-accent font-black uppercase text-xs tracking-widest flex items-center gap-2">
          <span className="w-1 h-1 bg-accent"></span> Q: {faq.question}
        </h3>
        <div className="bg-panel/30 p-4 rounded-lg border border-border/40 text-tx-muted text-sm leading-relaxed group-hover:text-tx-main transition-colors">
          {faq.answer}
        </div>
      </div>
    ))}
  </MetaContainer>
);

// --- GUIDE ---
export const GuideView = () => (
  <MetaContainer title="Field Manual">
    <div className="grid gap-6">
      {GUIDE_DATA.map((section) => (
        <div
          key={section.title}
          className="flex gap-6 items-start p-4 bg-panel/10 rounded-xl border border-border/20"
        >
          {section.icon && (
            <img
              src={section.icon}
              className="w-12 h-12 pixelated shrink-0 brightness-110"
              alt=""
            />
          )}
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-tx-main uppercase tracking-tight italic">
              {section.title}
            </h3>
            <p className="text-sm text-tx-muted leading-relaxed">
              {section.content}
            </p>
          </div>
        </div>
      ))}
    </div>
  </MetaContainer>
);

// --- PRIVACY POLICY VIEW ---
export const PrivacyPolicyView = () => (
  <MetaContainer title="Privacy Policy">
    <div className="bg-panel/20 p-8 rounded-2xl border border-border/30 text-tx-muted leading-relaxed text-sm whitespace-pre-wrap font-sans">
      {PRIVACY_POLICY_TEXT}
    </div>
  </MetaContainer>
);

// --- GENERIC SIMPLE TEXT VIEW ---
export const SimpleTextView = ({
  title,
  content,
}: {
  title: string;
  content: string;
}) => (
  <MetaContainer title={title}>
    <div className="bg-panel/20 p-8 rounded-2xl border border-border/30 text-tx-muted leading-relaxed text-sm whitespace-pre-wrap">
      {content}
    </div>
  </MetaContainer>
);
