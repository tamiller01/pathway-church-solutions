import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/sermon", destination: "/sermons/new", permanent: true },
      { source: "/worship", destination: "/worship-plans/new", permanent: true },
      { source: "/discipleship", destination: "/discipleship-plans/new", permanent: true },
      { source: "/plans", destination: "/discipleship-plans", permanent: true },
      { source: "/plans/:id", destination: "/discipleship-plans/:id", permanent: true }
    ];
  }
};

export default nextConfig;
