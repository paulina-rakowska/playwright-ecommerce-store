import { setWorldConstructor, World, IWorldOptions, IWorld } from '@cucumber/cucumber';
import { Browser, BrowserContext, Page} from '@playwright/test';
import { ICustomWorld } from './world.types';

export class CustomWorld extends World implements ICustomWorld {
    // browser?: Browser;   browser is defined in hooks.ts
    context: BrowserContext;
    page: Page;
    testContext?: TestContext;

    constructor(options: IWorldOptions) {
        super(options);
    }
}

setWorldConstructor(CustomWorld)

