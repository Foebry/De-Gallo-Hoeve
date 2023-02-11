require('ts-node').register({ transpileOnly: true });

const tsConfigPaths = require('tsconfig-paths');
tsConfigPaths.register();

require('../src/cli/root');
