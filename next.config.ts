import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig: NextConfig = {
  poweredByHeader: false,
  // Content files are read from disk at render time (ISR); ship them with every function.
  outputFileTracingIncludes: { "/**": ["./content/**/*"] },
};

export default withNextIntl(nextConfig);
