import { Icon, type IconName } from "@/components/ui/icon";

const STEPS: [string, string, string, IconName][] = [
  [
    "01",
    "Learn",
    "Access focused lessons covering techniques, knowledge, and the skills that matter in your profession..",
    "video",
  ],
  [
    "02",
    "Practice",
    "Test your knowledge and submit practical work to reinforce new skills and identify where you can improve.",
    "zap",
  ],
  [
    "03",
    "Get certified",
    "Receive guidance from educators, track your development, and earn certifications as you build your skills.",
    "award",
  ],
];

export function How() {
  return (
    <section className="sec how" id="how">
      <div className="sec-in">
        <div className="rv how-head">
          <h1 className="rs-eyebrow">How it works</h1>
          <h2 className="rs-display sec-h2">
            Learn, practice, and prove your skills.
          </h2>
          <p className="sec-lede">
            Professional education designed to fit into the way you already
            work. Learn from industry educators, put new techniques into
            practice, get feedback on your work, and build credentials as you
            progress.
          </p>
        </div>
        <div className="how-grid">
          {STEPS.map(([n, t, b, ic]) => (
            <div key={n} className="rv how-card">
              <span className="how-n">{n}</span>
              <span className="how-ic">
                <Icon name={ic} size={20} c="var(--clay-deep)" />
              </span>
              <h3>{t}</h3>
              <p>{b}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
