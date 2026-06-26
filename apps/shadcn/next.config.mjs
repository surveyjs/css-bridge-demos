/** @type {import('next').NextConfig} */
import { applyDevWatchPatches } from "../../scripts/webpack-dev-watch.mjs";

const nextConfig = {
  reactStrictMode: true,
  experimental: {
    externalDir: true,
  },
  // Linked local SurveyJS builds ship ESM/source that Next must transpile.
  // `@bridge/schemas` is listed too so Next compiles it into the app's watch
  // graph instead of treating it as an external node_module — otherwise a
  // running `next dev` keeps serving the `dist/` it loaded at startup and never
  // picks up schema rebuilds. (Mirrors apps/bootstrap and apps/mui exactly.)
  transpilePackages: [
    "survey-core",
    "survey-react-ui",
    "survey-creator-core",
    "survey-creator-react",
    "@bridge/schemas",
  ],
  webpack: (config, { dev }) => {
    // Single React instance. The linked SurveyJS builds live OUTSIDE the
    // workspace (absolute `file:` symlinks) and have no React of their own, so
    // they must resolve the app's copy. npm hoists exactly one react/react-dom
    // (enforced by the root `overrides`); disabling symlink realpath
    // resolution keeps those external packages resolving modules through the
    // app's node_modules instead of walking up their own (React-less) tree.
    // We deliberately do NOT hard-alias `react`, which would break Next's App
    // Router RSC layer (it relies on the `react-server` conditional export).
    config.resolve.symlinks = false;

    if (dev) {
      applyDevWatchPatches(config);
    }

    return config;
  },
};

export default nextConfig;
