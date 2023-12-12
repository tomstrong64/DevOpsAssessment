import puppeteer from 'puppeteer';
try {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    const timeout = 60000;
    page.setDefaultTimeout(timeout);
    page.on('dialog', async (dialog) => {
        console.log(dialog.message());
        if (dialog.message().includes('?')) return await dialog.accept();
        return await dialog.dismiss();
    });

    {
        const targetPage = page;
        await targetPage.setViewport({
            width: 1295,
            height: 976,
        });
    }

    {
        const targetPage = page;
        const promises = [];
        const startWaitingForEvents = () => {
            promises.push(targetPage.waitForNavigation());
        };
        startWaitingForEvents();
        await targetPage.goto('http://localhost:3000/register');
        await Promise.all(promises);
    }
    {
        const targetPage = page;
        const target = await Promise.race([
            targetPage.locator('#username'),
            targetPage.locator('::-p-xpath(//*[@id=\\"username\\"])'),
        ]);
        target.setTimeout(timeout);
        await target.click({
            offset: {
                x: 150,
                y: 24.40625,
            },
        });
    }
    {
        const targetPage = page;
        const promises = [];
        const startWaitingForEvents = () => {
            promises.push(targetPage.waitForNavigation());
        };
        startWaitingForEvents();
        const target = await Promise.race([
            targetPage.locator('#username'),
            targetPage.locator('::-p-xpath(//*[@id=\\"username\\"])'),
        ]);
        target.setTimeout(timeout);
        await target.fill('Test');
    }
    {
        const targetPage = page;
        const promises = [];
        const startWaitingForEvents = () => {
            promises.push(targetPage.waitForNavigation());
        };
        startWaitingForEvents();
        const target = await Promise.race([
            targetPage.locator('#email'),
            targetPage.locator('::-p-xpath(//*[@id=\\"email\\"])'),
        ]);
        target.setTimeout(timeout);
        await target.click({
            offset: {
                x: 53,
                y: 8.40625,
            },
        });
    }
    {
        const targetPage = page;
        const promises = [];
        const startWaitingForEvents = () => {
            promises.push(targetPage.waitForNavigation());
        };
        startWaitingForEvents();
        const target = await Promise.race([
            targetPage.locator('#email'),
            targetPage.locator('::-p-xpath(//*[@id=\\"email\\"])'),
        ]);
        target.setTimeout(timeout);
        await target.fill('test@gmail.com');
    }
    {
        const targetPage = page;
        const promises = [];
        const startWaitingForEvents = () => {
            promises.push(targetPage.waitForNavigation());
        };
        startWaitingForEvents();
        const target = await Promise.race([
            targetPage.locator('#password'),
            targetPage.locator('::-p-xpath(//*[@id=\\"password\\"])'),
        ]);
        target.setTimeout(timeout);
        await target.click({
            offset: {
                x: 101,
                y: 34.40625,
            },
        });
    }
    {
        const targetPage = page;
        const promises = [];
        const startWaitingForEvents = () => {
            promises.push(targetPage.waitForNavigation());
        };
        startWaitingForEvents();
        const target = await Promise.race([
            targetPage.locator('#password'),
            targetPage.locator('::-p-xpath(//*[@id=\\"password\\"])'),
        ]);
        target.setTimeout(timeout);
        await target.fill('123');
    }
    {
        const targetPage = page;
        const promises = [];
        const startWaitingForEvents = () => {
            promises.push(targetPage.waitForNavigation());
        };
        startWaitingForEvents();
        const target = await Promise.race([
            targetPage.locator('#privacy'),
            targetPage.locator('::-p-xpath(//*[@id=\\"privacy\\"])'),
        ]);
        target.setTimeout(timeout);
        await target.click({
            offset: {
                x: 7,
                y: 4.40625,
            },
        });
    }
    {
        const targetPage = page;
        const promises = [];
        const startWaitingForEvents = () => {
            promises.push(targetPage.waitForNavigation());
        };
        startWaitingForEvents();
        const target = await Promise.race([
            targetPage.locator('#register'),
            targetPage.locator('::-p-xpath(//*[@id=\\"register\\"])'),
        ]);
        target.setTimeout(timeout);
        target.on('action', () => startWaitingForEvents());
        await target.click({
            offset: {
                x: 47,
                y: 17.40625,
            },
        });
        await Promise.all(promises);
    }
    {
        const targetPage = page;
        const promises = [];
        const startWaitingForEvents = () => {
            promises.push(targetPage.waitForNavigation());
        };
        startWaitingForEvents();
        const target = await Promise.race([
            targetPage.locator('li:nth-of-type(1) > a'),
            targetPage.locator(
                '::-p-xpath(//*[@id=\\"siteNavbar\\"]/ul/li[1]/a)'
            ),
            targetPage.locator('::-p-text(Add POI)'),
        ]);
        target.setTimeout(timeout);
        target.on('action', () => startWaitingForEvents());
        await target.click({
            offset: {
                x: 53.640625,
                y: 22,
            },
        });
        await Promise.all(promises);
    }
    {
        const targetPage = page;
        const promises = [];
        const startWaitingForEvents = () => {
            promises.push(targetPage.waitForNavigation());
        };
        startWaitingForEvents();
        const target = await Promise.race([
            targetPage.locator('#name'),
            targetPage.locator('::-p-xpath(//*[@id=\\"name\\"])'),
        ]);
        target.setTimeout(timeout);
        await target.click({
            offset: {
                x: 143.5,
                y: 11.40625,
            },
        });
    }
    {
        const targetPage = page;
        const promises = [];
        const startWaitingForEvents = () => {
            promises.push(targetPage.waitForNavigation());
        };
        startWaitingForEvents();
        const target = await Promise.race([
            targetPage.locator('#name'),
            targetPage.locator('::-p-xpath(//*[@id=\\"name\\"])'),
        ]);
        target.setTimeout(timeout);
        await target.fill('test');
    }
    {
        const targetPage = page;
        const promises = [];
        const startWaitingForEvents = () => {
            promises.push(targetPage.waitForNavigation());
        };
        startWaitingForEvents();
        const target = await Promise.race([
            targetPage.locator('#type'),
            targetPage.locator('::-p-xpath(//*[@id=\\"type\\"])'),
        ]);
        target.setTimeout(timeout);
        await target.click({
            offset: {
                x: 72.5,
                y: 12.40625,
            },
        });
    }
    {
        const targetPage = page;
        const promises = [];
        const startWaitingForEvents = () => {
            promises.push(targetPage.waitForNavigation());
        };
        startWaitingForEvents();
        const target = await Promise.race([
            targetPage.locator('#type'),
            targetPage.locator('::-p-xpath(//*[@id=\\"type\\"])'),
        ]);
        target.setTimeout(timeout);
        await target.fill('testing');
    }
    {
        const targetPage = page;
        const promises = [];
        const startWaitingForEvents = () => {
            promises.push(targetPage.waitForNavigation());
        };
        startWaitingForEvents();
        const target = await Promise.race([
            targetPage.locator('#country'),
            targetPage.locator('::-p-xpath(//*[@id=\\"country\\"])'),
        ]);
        target.setTimeout(timeout);
        await target.click({
            offset: {
                x: 67.5,
                y: 6.40625,
            },
        });
    }
    {
        const targetPage = page;
        const promises = [];
        const startWaitingForEvents = () => {
            promises.push(targetPage.waitForNavigation());
        };
        startWaitingForEvents();
        const target = await Promise.race([
            targetPage.locator('#country'),
            targetPage.locator('::-p-xpath(//*[@id=\\"country\\"])'),
        ]);
        target.setTimeout(timeout);
        await target.fill('London');
    }
    {
        const targetPage = page;
        const promises = [];
        const startWaitingForEvents = () => {
            promises.push(targetPage.waitForNavigation());
        };
        startWaitingForEvents();
        const target = await Promise.race([
            targetPage.locator('#region'),
            targetPage.locator('::-p-xpath(//*[@id=\\"region\\"])'),
        ]);
        target.setTimeout(timeout);
        await target.click({
            offset: {
                x: 57.5,
                y: 16.40625,
            },
        });
    }
    {
        const targetPage = page;
        const promises = [];
        const startWaitingForEvents = () => {
            promises.push(targetPage.waitForNavigation());
        };
        startWaitingForEvents();
        const target = await Promise.race([
            targetPage.locator('#region'),
            targetPage.locator('::-p-xpath(//*[@id=\\"region\\"])'),
        ]);
        target.setTimeout(timeout);
        await target.fill('London');
    }
    {
        const targetPage = page;
        const promises = [];
        const startWaitingForEvents = () => {
            promises.push(targetPage.waitForNavigation());
        };
        startWaitingForEvents();
        const target = await Promise.race([
            targetPage.locator('#lat'),
            targetPage.locator('::-p-xpath(//*[@id=\\"lat\\"])'),
        ]);
        target.setTimeout(timeout);
        await target.click({
            offset: {
                x: 54.5,
                y: 15.40625,
            },
        });
    }
    {
        const targetPage = page;
        const promises = [];
        const startWaitingForEvents = () => {
            promises.push(targetPage.waitForNavigation());
        };
        startWaitingForEvents();
        const target = await Promise.race([
            targetPage.locator('#lat'),
            targetPage.locator('::-p-xpath(//*[@id=\\"lat\\"])'),
        ]);
        target.setTimeout(timeout);
        await target.fill('60.74');
    }
    {
        const targetPage = page;
        const promises = [];
        const startWaitingForEvents = () => {
            promises.push(targetPage.waitForNavigation());
        };
        startWaitingForEvents();
        const target = await Promise.race([
            targetPage.locator('#lon'),
            targetPage.locator('::-p-xpath(//*[@id=\\"lon\\"])'),
        ]);
        target.setTimeout(timeout);
        await target.click({
            offset: {
                x: 78.5,
                y: 20.40625,
            },
        });
    }
    {
        const targetPage = page;
        const promises = [];
        const startWaitingForEvents = () => {
            promises.push(targetPage.waitForNavigation());
        };
        startWaitingForEvents();
        const target = await Promise.race([
            targetPage.locator('#lon'),
            targetPage.locator('::-p-xpath(//*[@id=\\"lon\\"])'),
        ]);
        target.setTimeout(timeout);
        await target.fill('50.65');
    }
    {
        const targetPage = page;
        const promises = [];
        const startWaitingForEvents = () => {
            promises.push(targetPage.waitForNavigation());
        };
        startWaitingForEvents();
        const target = await Promise.race([
            targetPage.locator('#description'),
            targetPage.locator('::-p-xpath(//*[@id=\\"description\\"])'),
        ]);
        target.setTimeout(timeout);
        await target.click({
            offset: {
                x: 169.5,
                y: 29.40625,
            },
        });
    }
    {
        const targetPage = page;
        const promises = [];
        const startWaitingForEvents = () => {
            promises.push(targetPage.waitForNavigation());
        };
        startWaitingForEvents();
        const target = await Promise.race([
            targetPage.locator('#description'),
            targetPage.locator('::-p-xpath(//*[@id=\\"description\\"])'),
        ]);
        target.setTimeout(timeout);
        await target.fill('testing');
    }
    {
        const targetPage = page;
        const promises = [];
        const startWaitingForEvents = () => {
            promises.push(targetPage.waitForNavigation());
        };
        startWaitingForEvents();
        const target = await Promise.race([
            targetPage.locator('#ADD\\ POI'),
            targetPage.locator('::-p-xpath(//*[@id=\\"ADD POI\\"])'),
        ]);
        target.setTimeout(timeout);
        target.on('action', () => startWaitingForEvents());
        await target.click({
            offset: {
                x: 31.734375,
                y: 16.21875,
            },
        });
        await Promise.all(promises);
    }
    {
        const targetPage = page;
        const promises = [];
        const startWaitingForEvents = () => {
            promises.push(targetPage.waitForNavigation());
        };
        startWaitingForEvents();
        const target = await Promise.race([
            targetPage.locator('#poi_search'),
            targetPage.locator('::-p-xpath(//*[@id=\\"poi_search\\"])'),
            targetPage.locator('::-p-text(Search)'),
        ]);
        target.setTimeout(timeout);
        await target.click({
            offset: {
                x: 35.5,
                y: 20,
            },
        });
    }
    {
        const targetPage = page;
        const promises = [];
        const startWaitingForEvents = () => {
            promises.push(targetPage.waitForNavigation());
        };
        startWaitingForEvents();
        const target = await Promise.race([
            targetPage.locator('#poi_results a'),
            targetPage.locator(
                '::-p-xpath(//*[@id=\\"6578617aa4e44ca49ab31dc7\\"]/td[8]/a)'
            ),
        ]);
        target.setTimeout(timeout);
        target.on('action', () => startWaitingForEvents());
        await target.click({
            offset: {
                x: 2.3125,
                y: 13.40625,
            },
        });
        await Promise.all(promises);
    }
    {
        const targetPage = page;
        const promises = [];
        const startWaitingForEvents = () => {
            promises.push(targetPage.waitForNavigation());
        };
        startWaitingForEvents();
        const target = await Promise.race([
            targetPage.locator('#name'),
            targetPage.locator('::-p-xpath(//*[@id=\\"name\\"])'),
        ]);
        target.setTimeout(timeout);
        await target.click({
            offset: {
                x: 116.5,
                y: 20.40625,
            },
        });
    }
    {
        const targetPage = page;
        const promises = [];
        const startWaitingForEvents = () => {
            promises.push(targetPage.waitForNavigation());
        };
        startWaitingForEvents();
        const target = await Promise.race([
            targetPage.locator('#name'),
            targetPage.locator('::-p-xpath(//*[@id=\\"name\\"])'),
        ]);
        target.setTimeout(timeout);
        await target.fill('test update');
    }
    {
        const targetPage = page;
        const promises = [];
        const startWaitingForEvents = () => {
            promises.push(targetPage.waitForNavigation());
        };
        startWaitingForEvents();
        const target = await Promise.race([
            targetPage.locator('#type'),
            targetPage.locator('::-p-xpath(//*[@id=\\"type\\"])'),
        ]);
        target.setTimeout(timeout);
        await target.click({
            offset: {
                x: 108.5,
                y: 30.40625,
            },
        });
    }
    {
        const targetPage = page;
        const promises = [];
        const startWaitingForEvents = () => {
            promises.push(targetPage.waitForNavigation());
        };
        startWaitingForEvents();
        const target = await Promise.race([
            targetPage.locator('#type'),
            targetPage.locator('::-p-xpath(//*[@id=\\"type\\"])'),
        ]);
        target.setTimeout(timeout);
        await target.fill('testing update');
    }
    {
        const targetPage = page;
        const promises = [];
        const startWaitingForEvents = () => {
            promises.push(targetPage.waitForNavigation());
        };
        startWaitingForEvents();
        const target = await Promise.race([
            targetPage.locator('#region'),
            targetPage.locator('::-p-xpath(//*[@id=\\"region\\"])'),
        ]);
        target.setTimeout(timeout);
        await target.click({
            offset: {
                x: 61.5,
                y: 11.40625,
            },
        });
    }
    {
        const targetPage = page;
        const promises = [];
        const startWaitingForEvents = () => {
            promises.push(targetPage.waitForNavigation());
        };
        startWaitingForEvents();
        const target = await Promise.race([
            targetPage.locator('#region'),
            targetPage.locator('::-p-xpath(//*[@id=\\"region\\"])'),
        ]);
        target.setTimeout(timeout);
        await target.click({
            offset: {
                x: 78.5,
                y: 17.40625,
            },
        });
    }
    {
        const targetPage = page;
        const promises = [];
        const startWaitingForEvents = () => {
            promises.push(targetPage.waitForNavigation());
        };
        startWaitingForEvents();
        const target = await Promise.race([
            targetPage.locator('#description'),
            targetPage.locator('::-p-xpath(//*[@id=\\"description\\"])'),
        ]);
        target.setTimeout(timeout);
        await target.click({
            offset: {
                x: 113.5,
                y: 29.40625,
            },
        });
    }
    {
        const targetPage = page;
        const promises = [];
        const startWaitingForEvents = () => {
            promises.push(targetPage.waitForNavigation());
        };
        startWaitingForEvents();
        const target = await Promise.race([
            targetPage.locator('#description'),
            targetPage.locator('::-p-xpath(//*[@id=\\"description\\"])'),
        ]);
        target.setTimeout(timeout);
        await target.fill('testing Update');
    }
    {
        const targetPage = page;
        const promises = [];
        const startWaitingForEvents = () => {
            promises.push(targetPage.waitForNavigation());
        };
        startWaitingForEvents();
        const target = await Promise.race([
            targetPage.locator('#UPDATE\\ POI'),
            targetPage.locator('::-p-xpath(//*[@id=\\"UPDATE POI\\"])'),
        ]);
        target.setTimeout(timeout);
        target.on('action', () => startWaitingForEvents());
        await target.click({
            offset: {
                x: 66.296875,
                y: 22.21875,
            },
        });
        await Promise.all(promises);
    }
    {
        const targetPage = page;
        const promises = [];
        const startWaitingForEvents = () => {
            promises.push(targetPage.waitForNavigation());
        };
        startWaitingForEvents();
        const target = await Promise.race([
            targetPage.locator('#poi_search'),
            targetPage.locator('::-p-xpath(//*[@id=\\"poi_search\\"])'),
            targetPage.locator('::-p-text(Search)'),
        ]);
        target.setTimeout(timeout);
        await target.click({
            offset: {
                x: 46.5,
                y: 9,
            },
        });
    }
    {
        const targetPage = page;
        const promises = [];
        const startWaitingForEvents = () => {
            promises.push(targetPage.waitForNavigation());
        };
        startWaitingForEvents();
        const target = await Promise.race([
            targetPage.locator('td:nth-of-type(9) > button'),
            targetPage.locator(
                '::-p-xpath(//*[@id=\\"6578617aa4e44ca49ab31dc7\\"]/td[9]/button)'
            ),
        ]);
        target.setTimeout(timeout);
        await target.click({
            offset: {
                x: 28.1875,
                y: 13.40625,
            },
        });
    }
    {
        const targetPage = page;
        const promises = [];
        const startWaitingForEvents = () => {
            promises.push(targetPage.waitForNavigation());
        };
        startWaitingForEvents();
        const target = await Promise.race([
            targetPage.locator('li:nth-of-type(6) > a'),
            targetPage.locator(
                '::-p-xpath(//*[@id=\\"siteNavbar\\"]/ul/li[6]/a)'
            ),
            targetPage.locator('::-p-text(Profile)'),
        ]);
        target.setTimeout(timeout);
        target.on('action', () => startWaitingForEvents());
        await target.click({
            offset: {
                x: 39.9375,
                y: 26,
            },
        });
        await Promise.all(promises);
    }
    {
        const targetPage = page;
        const promises = [];
        const startWaitingForEvents = () => {
            promises.push(targetPage.waitForNavigation());
        };
        startWaitingForEvents();
        const target = await Promise.race([
            targetPage.locator('#LOGOUT\\ USER'),
            targetPage.locator('::-p-xpath(//*[@id=\\"LOGOUT USER\\"])'),
            targetPage.locator('::-p-text(Logout)'),
        ]);
        target.setTimeout(timeout);
        target.on('action', () => startWaitingForEvents());
        await target.click({
            offset: {
                x: 48.234375,
                y: 19.40625,
            },
        });
        await Promise.all(promises);
    }

    {
        const targetPage = page;
        const promises = [];
        const startWaitingForEvents = () => {
            promises.push(targetPage.waitForNavigation());
        };
        startWaitingForEvents();
        const target = await Promise.race([
            targetPage.locator('#email'),
            targetPage.locator('::-p-xpath(//*[@id=\\"email\\"])'),
        ]);
        target.setTimeout(timeout);
        await target.click({
            offset: {
                x: 124,
                y: 24.40625,
            },
        });
    }
    {
        const targetPage = page;
        const promises = [];
        const startWaitingForEvents = () => {
            promises.push(targetPage.waitForNavigation());
        };
        startWaitingForEvents();
        const target = await Promise.race([
            targetPage.locator('#email'),
            targetPage.locator('::-p-xpath(//*[@id=\\"email\\"])'),
        ]);
        target.setTimeout(timeout);
        await target.fill('test@gmail.com');
    }
    {
        const targetPage = page;
        const promises = [];
        const startWaitingForEvents = () => {
            promises.push(targetPage.waitForNavigation());
        };
        startWaitingForEvents();
        const target = await Promise.race([
            targetPage.locator('#password'),
            targetPage.locator('::-p-xpath(//*[@id=\\"password\\"])'),
        ]);
        target.setTimeout(timeout);
        await target.click({
            offset: {
                x: 124,
                y: 18.40625,
            },
        });
    }
    {
        const targetPage = page;
        const promises = [];
        const startWaitingForEvents = () => {
            promises.push(targetPage.waitForNavigation());
        };
        startWaitingForEvents();
        const target = await Promise.race([
            targetPage.locator('#password'),
            targetPage.locator('::-p-xpath(//*[@id=\\"password\\"])'),
        ]);
        target.setTimeout(timeout);
        await target.fill('123');
    }
    {
        const targetPage = page;
        const promises = [];
        const startWaitingForEvents = () => {
            promises.push(targetPage.waitForNavigation());
        };
        startWaitingForEvents();
        const target = await Promise.race([
            targetPage.locator('#login'),
            targetPage.locator('::-p-xpath(//*[@id=\\"login\\"])'),
        ]);
        target.setTimeout(timeout);
        target.on('action', () => startWaitingForEvents());
        await target.click({
            offset: {
                x: 28,
                y: 24.40625,
            },
        });
        await Promise.all(promises);
    }
    {
        const targetPage = page;
        const promises = [];
        const startWaitingForEvents = () => {
            promises.push(targetPage.waitForNavigation());
        };
        startWaitingForEvents();
        const target = await Promise.race([
            targetPage.locator('li:nth-of-type(6) > a'),
            targetPage.locator(
                '::-p-xpath(//*[@id=\\"siteNavbar\\"]/ul/li[6]/a)'
            ),
            targetPage.locator('::-p-text(Profile)'),
        ]);
        target.setTimeout(timeout);
        target.on('action', () => startWaitingForEvents());
        await target.click({
            offset: {
                x: 29.9375,
                y: 21,
            },
        });
        await Promise.all(promises);
    }
    {
        const targetPage = page;
        const promises = [];
        const startWaitingForEvents = () => {
            promises.push(targetPage.waitForNavigation());
        };
        startWaitingForEvents();
        const target = await Promise.race([
            targetPage.locator('#Password'),
            targetPage.locator('::-p-xpath(//*[@id=\\"Password\\"])'),
        ]);
        target.setTimeout(timeout);
        await target.click({
            offset: {
                x: 42.5,
                y: 26.40625,
            },
        });
    }
    {
        const targetPage = page;
        const promises = [];
        const startWaitingForEvents = () => {
            promises.push(targetPage.waitForNavigation());
        };
        startWaitingForEvents();
        const target = await Promise.race([
            targetPage.locator('#Password'),
            targetPage.locator('::-p-xpath(//*[@id=\\"Password\\"])'),
            targetPage.locator(':scope >>> #Password'),
        ]);
        target.setTimeout(timeout);
        await target.fill('123');
    }

    {
        const targetPage = page;
        const promises = [];
        const startWaitingForEvents = () => {
            promises.push(targetPage.waitForNavigation());
        };
        const target = await Promise.race([
            targetPage.locator('::-p-aria(Delete Account)'),
            targetPage.locator('#DELETE\\ USER'),
            targetPage.locator('::-p-xpath(//*[@id=\\"DELETE USER\\"])'),
            targetPage.locator(':scope >>> #DELETE\\ USER'),
            targetPage.locator('::-p-text(Delete Account)'),
        ]);

        target.setTimeout(timeout);
        await target.click({
            offset: {
                x: 81.3125,
                y: 15.40625,
            },
        });
        await Promise.all(promises);
    }

    await browser.close();
} catch (err) {
    console.error(err);
    process.exit(1);
}
