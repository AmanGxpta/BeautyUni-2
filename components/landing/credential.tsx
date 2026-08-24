import { Icon, type IconName } from "@/components/ui/icon";
import { RSLogo } from "@/components/ui/logo";

const POINTS: [IconName, string, string][] = [
  ["award", "Educator-signed", "Issued by the person who reviewed your work, not an algorithm."],
  ["globe", "Verifiable link", "A public page employers and clients can check in one tap."],
  ["download", "Yours to keep", "Download the PDF, share the card, add it to your profile."],
];

export function Credential() {
  return (
    <section className="sec cred" id="credential">
      <div className="sec-in cred-in">
        <div className="rv cred-copy">
          <div className="rs-eyebrow">The credential</div>
          <h2 className="rs-display sec-h2">Finish the course, walk out with something you can show.</h2>
          <p className="sec-lede">
            Every course closes with a final exam and a reviewed submission. Pass both and Rockstar issues a
            certificate signed by your educator — a link for your bio, a PDF for the salon wall.
          </p>
          <ul className="cred-list">
            {POINTS.map(([ic, t, b]) => (
              <li key={t}>
                <span>
                  <Icon name={ic} size={18} c="var(--gold)" />
                </span>
                <div>
                  <b>{t}</b>
                  {b}
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="rv cert-wrap">
          <div className="cert">
            <div className="cert-top">
              <RSLogo size={15} />
              <span className="cert-tag">Certificate of completion</span>
            </div>
            <div className="cert-seal">
              <Icon name="award" size={28} c="var(--gold)" />
            </div>
            <div className="cert-name rs-display">Balayage Foundations</div>
            <div className="cert-who">
              Awarded to <b>Maya Ortiz</b>
            </div>
            <div className="cert-meta">
              <div>
                <i>Educator</i>
                <b>Rae Mills</b>
              </div>
              <div>
                <i>Issued</i>
                <b>12 May 2026</b>
              </div>
              <div>
                <i>Credential ID</i>
                <b>RS-4471-BF</b>
              </div>
            </div>
            <div className="cert-foot">
              <Icon name="check" size={14} c="var(--gold)" /> Verified · rockstar.app/c/4471
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
