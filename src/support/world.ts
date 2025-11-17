import { World, IWorldOptions, setWorldConstructor } from '@cucumber/cucumber';
import { Browser, BrowserContext, Page} from '@playwright/test';

export class CustomWorld extends World {
    // browser?: Browser;   browser is defined in hooks.ts
    context?: BrowserContext;
    page?: Page;

    constructor(options: IWorldOptions) {
        super(options);
    }
}

setWorldConstructor(CustomWorld);

// handy type alias for steps
export type CucumberWorld = CustomWorld;
