import { WaitlistForm } from "./waitlist-form";

export function Join() {
  return (
    <section className="sec join" id="join">
      <div className="join-glow" />
      <div className="rv join-in">
        <div className="rs-eyebrow">Get in early</div>
        <h2 className="rs-display join-h2">
          Be part of the first generation of learners
        </h2>
        <p className="sec-lede join-lede">
          Starting with a small group of beauty professionals so we can build
          the learning experience around real feedback, real work, and real
          needs. Leave your email and we&rsquo;ll invite you when the next group
          opens.
        </p>
        <WaitlistForm big source="join" />
      </div>
    </section>
  );
}
