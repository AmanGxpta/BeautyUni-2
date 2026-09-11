import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/",
        destination: "/seminar-feedback",
        // Temporary so browsers and crawlers don't cache this forever
        // if the landing page comes back as the homepage.
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
