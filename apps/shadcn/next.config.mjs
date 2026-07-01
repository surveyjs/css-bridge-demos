/** @type {import('next').NextConfig} */
import { applyLocalSurveyJs } from "../../scripts/webpack-surveyjs-dev.mjs";

const nextConfig = {
  reactStrictMode: true,
  // The dev-only local SurveyJS builds live outside this app's dir.
  experimental: {
    externalDir: true,
  },
  // survey-* ship ESM/source that Next must transpile. `@bridge/schemas` is
  // listed too so Next compiles it into the app's watch graph instead of
  // treating it as an external node_module — otherwise a running `next dev`
  // keeps serving the `dist/` it loaded at startup and never picks up schema
  // rebuilds.
  transpilePackages: [
    "survey-core",
    "survey-react-ui",
    "survey-creator-core",
    "survey-creator-react",
    "@bridge/schemas",
  ],
  webpack: (config, { dev }) => {
    // Keep resolving the workspace-linked @bridge/schemas through this app's
    // node_modules rather than its realpath.
    config.resolve.symlinks = false;
    // In dev, alias survey-* to the local builds (if present); no-op in prod,
    // where the published npm `next` packages are used.
    return applyLocalSurveyJs(config, { dev });
  },
};

export default nextConfig;
