import { Nav } from "./nav";
import { Hero } from "./hero";
import { How } from "./how";
import { Showcase } from "./showcase";
import { Credential } from "./credential";
import { Join } from "./join";
import { SiteFooter } from "./site-footer";
import { CommunityDialogProvider } from "./community-dialog";

export function Landing() {
  return (
    <CommunityDialogProvider>
      <div className="rs lp">
        <Nav />
        <Hero />
        <How />
        <Showcase />
        <Credential />
        <Join />
        <SiteFooter />
      </div>
    </CommunityDialogProvider>
  );
}
