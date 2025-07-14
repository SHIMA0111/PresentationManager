import {BrowserContext, chromium, CDPSession, Page} from "playwright";

export class BrowserManager {
    private browser: BrowserContext | null;
    private pages: Page[];
    private cdpClients: { [key: number]: CDPSession };
    private width: number;
    private height: number;

    constructor(width: number = 1280, height: number = 720) {
        this.browser = null;
        this.pages = [];
        this.cdpClients = {};
        this.width = width;
        this.height = height;
    }

    async createBrowser(headless: boolean = true) {
        try {
            this.browser = await chromium.launchPersistentContext('', {
                headless,
                viewport: { width: this.width, height: this.height },
                executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
                args: [
                    // For Google Meet, this is necessary to join the meeting avoiding the bot detection.
                    '--disable-blink-features=AutomationControlled',
                    // Automations for screen and audio capture
                    '--auto-select-desktop-capture-source=Entire screen',
                    '--enable-usermedia-screen-capturing',
                    '--allow-http-screen-capture',
                    '--disable-web-security',
                    '--disable-features=VizDisplayCompositor',
                ],
                locale: 'en-US',
                permissions: ['microphone', 'camera', 'notifications'],
                ignoreHTTPSErrors: true,
                acceptDownloads: true,
                bypassCSP: true,
                timeout: 120000,
            });

            this.pages = this.browser.pages();
        } catch (error) {
            console.error('Failed to create browser: ', error);
            throw error;
        }
    }

    async gerOrCreatePage(forceNew: boolean = false): Promise<Page | null> {
        if (!this.browser) {
            console.log("You haven't created a browser yet. Please create a browser first.");
            return null
        }

        if (this.pages.length === 0 || forceNew) {
            const page = await this.browser.newPage();
            this.pages.push(page);

            return page;
        } else {

            return this.pages[0];
        }
    }

    async getPage(index: number = 0): Promise<Page | null> {
        if (this.pages.length <= index) {
            console.log("You haven't created a page yet. Please create a page first.");
            return null;
        }

        return this.pages[index];
    }

    async closeBrowser() {
        if (this.browser) {
            await this.browser.close();
            this.browser = null;
            this.pages = [];
        }
    }

    async getCDPClient(index: number = 0): Promise<CDPSession | null> {
        if (this.pages.length <= index) {
            console.log("You haven't created a page yet. Please create a page first.");
            return null;
        }

        if (index in this.cdpClients) {
            return this.cdpClients[index];
        }

        const page = this.pages[index];
        const cdpClient = await page.context().newCDPSession(page);
        this.cdpClients[index] = cdpClient;

        return cdpClient;
    }

    async closePage(index: number = 0) {
        if (this.pages.length === 0) {
            console.log("You haven't created a page yet. Please create a page first.");
            return;
        }

        // CDP client will be closed automatically when the page is closed.
        // await this.closeCDPClient(index);
        const page = this.pages[index];
        await page.close();
        this.pages.splice(index, 1);
    }

    async closeCDPClient(index: number = 0) {
        if (index in this.cdpClients) {
            const cdpClient = this.cdpClients[index];
            await cdpClient.detach();
            delete this.cdpClients[index];
        }
    }
}

// export async function generateBrowser(): Promise<{ browser: BrowserContext, cdpClient?: CDPSession }> {
//     const width = 1280;
//     const height = 720;

//     try {
//         console.log("Creating new browser...")

//         const browser = await chromium.launchPersistentContext('', {
//             headless: false,
//             viewport: { width, height },
//             executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
//             args: [
//                 // For Google Meet, this is necessary to join the meeting.
//                 '--disable-blink-features=AutomationControlled',
//                 // Automations for screen and audio capture
//                 '--auto-select-desktop-capture-source=Entire screen',
//                 '--enable-usermedia-screen-capturing',
//                 '--allow-http-screen-capture',
//                 '--disable-web-security',
//                 '--disable-features=VizDisplayCompositor',
//                 // Audio capture flags
//                 '--use-fake-ui-for-media-stream',  // Automatically allow microphone access without showing permission dialogs
//                 // Removed '--use-fake-device-for-media-stream' as it only produces beep sounds
//                 '--allow-file-access-from-files'  // Allow file access for media
//             ],
//             locale: 'en-US',
//             permissions: ['microphone', 'camera', 'notifications'],
//             ignoreHTTPSErrors: true,
//             acceptDownloads: true,
//             bypassCSP: true,
//             timeout: 120000,
//         });

//         console.log("Chromium browser created!");

//         // Create a new page if there are no pages
//         const pages = browser.pages();
//         const page = pages.length > 0 ? pages[0] : await browser.newPage();

//         // Get CDP client
//         const cdpClient = await page.context().newCDPSession(page);
//         console.log("CDP client created!");

//         return { browser, cdpClient };
//     } catch (error) {
//         console.error('Failed to create browser: ', error);
//         throw error;
//     }
// }
