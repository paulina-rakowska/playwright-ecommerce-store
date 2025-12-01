#############  INSTALACJA  ################

1. npm init playwright@latest   - all default settings
https://playwright.dev/docs/intro

2. npm install @cucumber/cucumber --save-dev
https://cucumber.io/docs/

Cucumber Gherkin language - for no technical people:
Gherkin language: Gherkin is a domain-specific language for writing Cucumber tests. It uses simple and clear syntax to define test scenarios in a given-when-then format.
Given: Describes the initial context or state.
When: Describes the action or event that triggers a behavior.
Then: Describes the expected outcome.

src/features + src/steps = Cucumber BDD tests

3. npm install ts-node --save-dev

So Cucumber can run TypeScript, TypeScript execution and REPL for node.js, with source map and native ESM support.

4. npm install dotenv --save-dev   
→ To manage secrets/config cleanly instead of hardcoding them. 
We install it because it’s the cleanest and most flexible way to manage environmental configuration for a test automation project.
In real test frameworks you often need variables like:

BASE_URL

USER_NAME

PASSWORD

ENVIRONMENT=dev|stage|prod

API_KEY

AWS mock credentials

Flags for running tests (e.g., HEADLESS=true)

Dotenv is a zero-dependency module that loads environment variables from a .env file into process.env. Storing configuration in the environment separate from code is based on The Twelve-Factor App methodology.

Without dotenv, these would end up hardcoded in:

test files

configs

step definitions

helper scripts

This breaks flexibility.

5. npm install cucumber-html-reporter --save-dev

cucumber-html-reporter Provide Cucumber JSON report file created from your framework and this module will create pretty HTML reports. Choose your best suitable HTML theme and dashboard on your CI with available HTML reporter plugins.
4 theme'y:
Bootstrap
Hierarchical
Foundation
Simple

Instalujemy bo: what a product owner or QA lead expects.

Playwright handles browser interactions, but Cucumber handles step definitions & BDD mapping.

So:

Playwright HTML report = dev-focused, low-level execution details

Cucumber HTML report = BDD-focused, high-level readable for management/QA

Bottom line:
You generate both reports because one is developer-focused, the other is stakeholder-focused.



Cucumber:
cucumber --init       -  Initialize the project:


cucumber.config.ts
This will configure Cucumber to run your .feature files with TypeScript step definitions.


export default {
  default: `--require-module ts-node/register --require src/steps/**/*.ts src/features/**/*.feature --format progress`,
};
--require-module ts-node/register → allows running TS directly

--require src/steps/**/*.ts → load all step definitions

src/features/**/*.feature → pick up all feature files

--format progress → simple console output (we’ll add HTML reporter later)

Optional extras (for later)
Tags filtering (--tags @smoke)

Strict mode (--strict)

Parallel execution (Cucumber 8+ supports it)

What happened before

You wrote a cucumber.config.ts using ESM (ECMAScript Modules) import syntax:

import { setDefaultTimeout } from "@cucumber/cucumber";
export default { ... }


Problem:

Node (and CucumberJS) expects CommonJS for config files (.js) by default.

.ts files aren’t automatically compiled when loading a config file — only step definitions are, because we use --require-module ts-node/register.

So Node sees import … in a .ts config file and throws:

Cannot use import statement outside a module

✅ Why cucumber.js works now

In the working version, we switched to:

module.exports = {
  default: [
    '--require-module ts-node/register',
    '--require src/steps/**/*.ts',
    '--format progress',
    'src/features/**/*.feature'
  ].join(' ')
};


Key differences:

Old	New
.ts config file	.js config file
import/export (ESM)	require/module.exports (CommonJS)
Node tried to execute TypeScript config directly	Node executes plain JS config → then Cucumber uses ts-node/register for step definitions

Important: Only step definitions and support code (world.ts, hooks.ts, page objects, utils) run in TypeScript — the config itself must be JS (CommonJS) for now.

Different conventions exist

Some tutorials (like the official 10-minute guide) use:

features/
  step_definitions/


Some JavaScript/TypeScript projects use:

src/features/
src/steps/


Some use /src/test/features and /src/test/steps for a “test-only” folder.

All are valid — the difference is mostly project organization and scale.

Why I suggested /src/features + /src/steps

Separation of concerns

src/pages → Page Object Model (your reusable UI logic)

src/utils → helpers, config, env loaders

src/features → Gherkin .feature files (BDD specification)

src/steps → step definitions that tie features to implementation

Scalability

In a large framework with many features and steps, keeping them in src/ avoids clutter in the project root.

Makes it easy to differentiate application code from tests if your repo also has other source code.

TypeScript / module resolution

TS compiler (tsconfig.json) works naturally with src/

You can easily import pages:

import { LoginPage } from "../pages/LoginPage";

2️⃣ Do we always start from Cucumber and then implement Playwright/TS?

This is about BDD workflow philosophy:

BDD / Cucumber-first approach

Write feature files first (Gherkin scenarios)

Example: login.feature

Run Cucumber

It will complain: “Undefined step” → gives you snippet

Implement step definitions using Playwright / TS

Tie Given/When/Then to actual browser actions

Run tests

Steps execute → scenarios pass/fail

✅ This is the recommended BDD approach, especially if your goal is:

Communication with Product Owner / QA / Stakeholders

Living documentation

Driving automation from requirements

Alternative: implement Playwright first

Sometimes teams just write Playwright scripts first, then wrap them in Cucumber later

Works fine for internal automation, but it loses the BDD benefits:

No readable features for non-devs

Harder to review scenarios before implementation

Summary

Cucumber-first → implement Playwright in steps ✅ (true BDD)

Playwright-first → wrap in Cucumber later ❌ (less ideal if doing BDD)

For your project: since the job description emphasizes Cucumber + BDD, you should start with feature files.

Run specific feature:


npm run test -- src/features/auth/login.feature
npm run test -- src/features/products/listing.feature
npm run test -- src/features/cart/add_to_cart.feature
npm run test -- src/features/products/sorting.feature
npm run test -- src/features/checkout/checkout.feature

npm run test:features 

