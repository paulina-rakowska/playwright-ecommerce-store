module.exports = {
  default: [
    '--require-module ts-node/register',       // allows TypeScript step definitions
    '--require src/steps/**/*.ts',             // load all your step definitions
    '--format progress',                        // simple console output
    'src/features/**/*.feature'                 // load all your feature files
  ].join(' ')
};