/** Dev-only webpack tweaks so linked SurveyJS + workspace schemas hot-reload. */

// Ignore node_modules except linked survey-* packages and @bridge/schemas.
const IGNORE_NODE_MODULES_EXCEPT_LINKED =
  /[\\/]node_modules[\\/](?!(survey-core|survey-react-ui|survey-creator-core|survey-creator-react)([\\/]|$)|@bridge[\\/]schemas([\\/]|$))/;

/**
 * @param {import('webpack').Configuration} config
 */
export function applyDevWatchPatches(config) {
  config.cache = false;
  config.snapshot = {
    ...config.snapshot,
    immutablePaths: [],
    managedPaths: [],
  };
  config.watchOptions = {
    ...config.watchOptions,
    followSymlinks: true,
    ignored: IGNORE_NODE_MODULES_EXCEPT_LINKED,
  };
}
