module.exports = {
    default: [
        "--require src/support/**/*.ts", // load world + hooks
        "--require src/steps/**/*.ts", // load all your step definitions
        "--format progress", // simple console output
        "--format json:reports/cucumber-report.json" //generate json report
        // 'src/features/**/*.feature'                 // load all your feature files
    ].join(" ")
};
