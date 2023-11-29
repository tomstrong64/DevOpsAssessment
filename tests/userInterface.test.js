import puppeteer from 'puppeteer';
import app from '../app.js';
import request from 'supertest';

let auth_token;

test('Check if the page title is correct', async () => {
    const browser = await puppeteer.launch({
        headless: false,
    });

    const response = await request(app)
        .post('/user/register')
        .set('Content-Type', 'application/json')
        .send({
            name: 'Admin',
            email: 'admin1@gmail.com',
            password: 'admin1password',
        });

    auth_token = response.body.token;

    const page = await browser.newPage();
    await page.goto('http://localhost:3000/', {
        waitUntil: 'domcontentloaded', // Wait for the DOM content to be loaded
    });

    // Get the actual title of the page
    const pageTitle = await page.title();

    // Replace 'Index Page' with the actual expected title
    expect(pageTitle).toBe('Index Page');

    await browser.close();
}, 20000); // 20 seconds timeout
