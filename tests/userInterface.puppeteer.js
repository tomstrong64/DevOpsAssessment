import puppeteer from 'puppeteer'; // v20.7.4 or later

try {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    const timeout = 5000;
    page.setDefaultTimeout(timeout);
    page.on('dialog', async (dialog) => {
        console.log(dialog.message());
        await dialog.dismiss();
    });

    {
        const targetPage = page;
        await targetPage.setViewport({
            width: 1875,
            height: 972,
        });
    }
    {
        const targetPage = page;
        const promises = [];
        const startWaitingForEvents = () => {
            promises.push(targetPage.waitForNavigation());
        };
        startWaitingForEvents();
        await targetPage.goto('http://localhost:3000/');
        await Promise.all(promises);
    }
    {
        const targetPage = page;
        const promises = [];
        const startWaitingForEvents = () => {
            promises.push(targetPage.waitForNavigation());
        };
        const target = await Promise.race([
            targetPage.locator('::-p-aria(Profile)'),
            targetPage.locator('a.btn'),
            targetPage.locator('::-p-xpath(/html/body/nav/a[5])'),
            targetPage.locator(':scope >>> a.btn'),
            targetPage.locator('::-p-text(Profile)'),
        ]);

        await target.click({
            offset: {
                x: 21.359375,
                y: 11,
            },
        });
        await Promise.all(promises);
    }

    await browser.close();
} catch (err) {
    console.error(err);
    process.exit(1);
}
