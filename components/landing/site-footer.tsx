import { RSLogo } from "@/components/ui/logo";

const COLUMNS: [string, string[]][] = [
  ["Product", ["The app", "Courses", "Certification", "Pricing"]],
  ["For educators", ["Teach on Rockstar", "Educator studio", "Review tools"]],
  ["Company", ["About", "Contact", "Careers"]],
];

export function SiteFooter() {
  return (
    <footer className="foot">
      <div className="foot-in">
        <div className="foot-brand">
          <RSLogo size={18} />
          <p>Education grounded in real-world practice.</p>
        </div>
        {COLUMNS.map(([t, links]) => (
          <div key={t} className="foot-col">
            <div className="foot-t">{t}</div>
            {links.map((l) => (
              <a key={l} href="#top">
                {l}
              </a>
            ))}
          </div>
        ))}
      </div>
      <div className="foot-legal">
        <span>© 2026 Rockstar</span>
        <span className="foot-legal-links">
          <a href="#top">Privacy</a>
          <a href="#top">Terms</a>
        </span>
      </div>
    </footer>
  );
}
