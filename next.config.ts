import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig: NextConfig = {
  poweredByHeader: false,
  // Content files (ISR) and OG-image fonts are read from disk at runtime; ship them with every function.
  outputFileTracingIncludes: { "/**": ["./content/**/*", "./assets/fonts/**/*"] },
};

export default withNextIntl(nextConfig);
