import { RSLogo } from "@/components/ui/logo";
import { CommunityCta } from "./community-dialog";

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
        <CommunityCta className="nav-cta" source="nav">
          Join the RS Community
        </CommunityCta>
      </div>
      <div className="nav-bar" />
    </header>
  );
}
