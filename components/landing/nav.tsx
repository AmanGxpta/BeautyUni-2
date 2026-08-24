import { RSLogo } from "@/components/ui/logo";

export function Nav() {
  return (
    <header className="nav">
      <div className="nav-in">
        <a className="nav-brand" href="#top">
          <RSLogo size={20} />
        </a>
        <nav className="nav-links">
          <a href="#how">How it works</a>
          <a href="#inside">Inside the app</a>
          <a href="#credential">Certification</a>
        </nav>
        <a className="nav-cta" href="#join">
          Join the waitlist
        </a>
      </div>
      <div className="nav-bar" />
    </header>
  );
}
