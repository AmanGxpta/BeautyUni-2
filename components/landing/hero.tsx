import { Icon } from "@/components/ui/icon";
import { Avatar } from "@/components/ui/primitives";
import { ScreenFeed } from "@/components/screens/feed";
import { Phone } from "./phone";
import { CommunityCta } from "./community-dialog";

const FACES = ["Rae Mills", "Jordan Lee", "Sam Rivera", "Ana Duarte"];

export function Hero() {
  return (
    <section className="hero" id="top">
      <div className="hero-glow" />
      <div className="hero-in">
        <div className="hero-copy">
          <div className="rs-eyebrow hero-eyebrow">
            Rolling out for · iOS &amp; Android
          </div>
          <h3 className="rs-display hero-h1">
            The learning platform for beauty professionals.
          </h3>
          <p className="hero-sub">
            Practical education for beauty professionals, delivered in short
            lessons with expert feedback, hands-on evaluation, and
            certifications you can build on
          </p>
          <CommunityCta className="wl-cta" source="hero">
            Join the RS Community <Icon name="chevR" size={17} />
          </CommunityCta>
          <div className="hero-trust">
            <div className="hero-faces">
              {FACES.map((n) => (
                <Avatar key={n} name={n} size={30} />
              ))}
            </div>
            <span>
              Built by professionals who know the craft and the industry.
            </span>
          </div>
        </div>

        <div className="hero-device">
          <Phone>
            <ScreenFeed />
          </Phone>
          <div className="hero-chip">
            <span className="hero-chip-ic">
              <Icon name="zap" size={15} c="#F0EDE8" />
            </span>
            <div>
              <b>One clip, one idea</b>
              <i>Then a quick check, right in the feed</i>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
