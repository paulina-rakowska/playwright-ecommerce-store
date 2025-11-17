const reporter = require('cucumber-html-reporter');
const path = require('path');

const options = {
  theme: 'bootstrap',
  jsonFile: path.join(__dirname, 'reports', 'cucumber-report.json'),
  output: path.join(__dirname, 'reports', 'cucumber-html-report', 'index.html'),
  reportSuiteAsScenarios: true,
  launchReport: false
};

reporter.generate(options);