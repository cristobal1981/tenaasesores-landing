import type { KnipConfig } from "knip"

const config: KnipConfig = {
  next: {
    entry: [
      "next.config.{js,mjs,ts}",
      "proxy.ts",
      "app/**/{page,layout,loading,error,not-found,global-error,default}.{tsx,ts}",
      "app/**/route.{tsx,ts}",
      "app/robots.ts",
      "app/sitemap.ts",
    ],
  },
  ignore: [
    "components/ui/**",
    "scripts/ci/**",
    "content/spain-provinces.ts",
    "components/ui/gradient-card.tsx",
    "src/modules/contact/infrastructure/contact-email-gateway.ts",
  ],
  ignoreBinaries: ["eslint"],
  ignoreDependencies: ["postcss", "tw-animate-css", "postcss-load-config"],
  ignoreExportsUsedInFile: {
    interface: true,
    type: true,
  },
  ignoreIssues: {
    "components/animations.tsx": ["exports"],
    "components/landing/**": ["exports"],
    "components/ui/**": ["exports", "types"],
    "content/**": ["exports", "types"],
    "lib/**": ["exports", "types"],
    "src/**": ["exports", "types"],
  },
}

export default config
