import type { ComponentType } from "react";
import { Icon } from "@/components/ui/icon";
import { ScreenFeedQuiz } from "@/components/screens/feed";
import { ScreenCourseOverview } from "@/components/screens/course-overview";
import { ScreenSubmit } from "@/components/screens/submit";
import { ScreenFeedback } from "@/components/screens/feedback";
import { ScreenExplore } from "@/components/screens/explore";
import { ScreenCerts } from "@/components/screens/certs";
import { Phone } from "./phone";

type Panel = {
  eyebrow: string;
  t: string;
  b: string;
  pts: string[];
  Screen: ComponentType;
};

const PANELS: Panel[] = [
  {
    eyebrow: "Learn",
    t: "Practical education from people who know the work.",
    b: "Build your skills through focused lessons from experienced educators, covering the techniques, knowledge, and practices that matter in your profession.",
    pts: [
      "Short, focused lessons built for working professionals",
      "Learn from educators with real industry experience",
    ],
    Screen: ScreenFeedQuiz,
  },

  {
    eyebrow: "Practice",
    t: "Turn what you learn into skills you can use.",
    b: "Test your understanding and put new techniques into practice while the lesson is still fresh. Learning doesn't stop when the video ends.",
    pts: [
      "Interactive checks reinforce what you've learned",
      "Practical challenges help turn knowledge into ability",
    ],
    Screen: ScreenCourseOverview,
  },

  {
    eyebrow: "Get feedback",
    t: "Know what to improve, not just what to watch next.",
    b: "Submit your work for review and get specific guidance from educators. Build on what you're doing well and understand where you can improve.",
    pts: [
      "Submit photos or videos of your work",
      "Receive practical feedback from industry educators",
    ],
    Screen: ScreenSubmit,
  },

  {
    eyebrow: "Get certified",
    t: "Turn your learning into something you can prove.",
    b: "Complete your learning, demonstrate your skills, and earn certifications that give you a clear record of the skills you've developed.",
    pts: [
      "Track your progress as you build new skills",
      "Earn certifications as you complete learning paths",
    ],
    Screen: ScreenFeedback,
  },
];

/**
 * Pinned showcase — the centre phone changes as you scroll.
 *
 * Two static phones sit behind it left and right, dimmed and pushed back, to
 * frame the one that is actually animating. They carry screens that are *not*
 * in the rotation (the catalog you pick from, the credential you walk out
 * with) so the group reads as one app rather than a repeat.
 *
 * Every centre frame is rendered up front and cross-faded by scroll-driven CSS
 * animations (`view-timeline` / `timeline-scope`, see app/globals.css). The
 * frames are addressed by `.show-frame-N` rather than `:nth-child` so that
 * adding siblings like the flankers cannot silently reindex the animation.
 */
export function Showcase() {
  return (
    <section className="show" id="inside">
      <div className="show-in">
        <div className="show-rail">
          <div className="show-device">
            <div className="show-glow" />
            <div className="show-side show-side-l" aria-hidden="true">
              <Phone>
                <ScreenExplore />
              </Phone>
            </div>
            <div className="show-side show-side-r" aria-hidden="true">
              <Phone>
                <ScreenCerts />
              </Phone>
            </div>
            {PANELS.map(({ Screen, eyebrow }, i) => (
              <div key={eyebrow} className={`show-frame show-frame-${i + 1}`}>
                <Phone>
                  <Screen />
                </Phone>
              </div>
            ))}
          </div>
          <div className="show-ticks">
            {PANELS.map((p, i) => (
              <a
                key={p.eyebrow}
                className="show-tick"
                href={"#panel-" + (i + 1)}
                aria-label={p.eyebrow}
              >
                <span />
              </a>
            ))}
          </div>
        </div>
        <div className="show-steps">
          {PANELS.map((p, i) => (
            <div className="show-step" key={p.t} id={"panel-" + (i + 1)}>
              <div className="show-kick">{p.eyebrow}</div>
              <h2 className="rs-display show-h2">{p.t}</h2>
              <p className="show-b">{p.b}</p>
              <ul className="show-pts">
                {p.pts.map((x) => (
                  <li key={x}>
                    <Icon name="check" size={15} c="var(--clay-deep)" />
                    {x}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
