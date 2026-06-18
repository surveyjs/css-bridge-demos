/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Linked local SurveyJS builds ship ESM/source that Next must transpile.
  // `@bridge/schemas` is listed too so Next compiles it into the app's watch
  // graph instead of treating it as an external node_module — otherwise a
  // running `next dev` keeps serving the `dist/` it loaded at startup and never
  // picks up schema rebuilds.
  transpilePackages: [
    "survey-core",
    "survey-react-ui",
    "survey-creator-core",
    "survey-creator-react",
    "@bridge/schemas",
  ],
  webpack: (config) => {
    // Single React instance. The linked SurveyJS builds live OUTSIDE the
    // workspace (absolute `link:` symlinks) and have no React of their own, so
    // they must resolve the app's copy. pnpm hoists exactly one react/react-dom
    // (enforced by the workspace `overrides`); disabling symlink realpath
    // resolution keeps those external packages resolving modules through the
    // app's node_modules instead of walking up their own (React-less) tree.
    // We deliberately do NOT hard-alias `react`, which would break Next's App
    // Router RSC layer (it relies on the `react-server` conditional export).
    config.resolve.symlinks = false;
    return config;
  },
};

export default nextConfig;
