require('dotenv').config();
const { test, expect } = require('@playwright/test');

let page;

test.describe.serial('Odoo End-to-End QA', () => {
	test.beforeAll(async ({ browser }) => {
		page = await browser.newPage();
		await page.goto(process.env.SERVER_LINK);
		await page.locator("//input[@name='login']").fill(process.env.ODOO_USERNAME);
		await page.locator("//input[@name='password']").fill(process.env.ODOO_PASSWORD);
		await page.getByRole('button', { name: 'Log in', exact: true }).click();
		await page.getByRole('button', { name: 'User' }).waitFor();

	});

	test('Verify the user can create Contact', async () => {
		await page.goto(process.env.SERVER_LINK);
		await page.getByRole('option', { name: 'Contacts' }).click();
		await page.getByRole('button', { name: 'New' }).click();
		await page.getByRole('combobox', { name: 'e.g. Lumber Inc' }).click();
		await page.getByRole('combobox', { name: 'e.g. Lumber Inc' }).fill('**Test Company 001**');
		await page.getByRole('textbox', { name: 'Street...' }).click();
		await page.getByRole('textbox', { name: 'Street...' }).click();
		await page.getByRole('textbox', { name: 'Street...' }).fill('7842 Big Timber Trail');
		await page.getByRole('textbox', { name: 'City' }).click();
		await page.getByRole('textbox', { name: 'City' }).fill('middleton');
		await page.getByRole('combobox', { name: 'Country' }).click();
		await page.getByRole('combobox', { name: 'Country' }).fill('united state');
		await page.getByRole('combobox', { name: 'Country' }).press('Enter');
		await page.getByRole('combobox', { name: 'State' }).click();
		await page.getByRole('combobox', { name: 'State' }).fill('wi');
		await page.getByRole('combobox', { name: 'State' }).press('Enter');
		await page.getByRole('textbox', { name: 'ZIP' }).click();
		await page.getByRole('textbox', { name: 'ZIP' }).fill('53562');
		await page.getByRole('combobox', { name: '/ if not applicable' }).click();
		await page.getByRole('combobox', { name: '/ if not applicable' }).fill('TAX001');
		await page.getByRole('textbox', { name: 'Phone' }).click();
		await page.getByRole('textbox', { name: 'Phone' }).fill('12345678999');
		await page.getByRole('textbox', { name: 'Mobile' }).click();
		await page.getByRole('textbox', { name: 'Mobile' }).fill('12345678999');
		await page.getByRole('textbox', { name: 'Email' }).click();
		await page.getByRole('textbox', { name: 'Email' }).fill('testCompany001@Example.com');
		await page.getByRole('textbox', { name: 'Website' }).click();
		await page.getByRole('textbox', { name: 'Website' }).fill('Testing.com');
		await page.getByRole('combobox', { name: 'Tags' }).click();
		await page.getByRole('option', { name: 'B2B' }).click();
		await page.waitForTimeout(2000);
		await page.getByRole('combobox', { name: 'Tags' }).click();
		await page.getByRole('option', { name: 'VIP' }).click();
		await page.getByRole('button', { name: 'Save manually' }).click();
		await page.getByRole('tab', { name: 'Sales & Purchase' }).click();
		await page.getByRole('combobox', { name: 'Salesperson?' }).click();
		await page.getByRole('option', { name: 'Administrator' }).click();
		await page.getByRole('textbox', { name: 'Barcode?' }).click();
		await page.getByRole('textbox', { name: 'Barcode?' }).fill('testCompany001');
		await page.getByRole('button', { name: 'Save manually' }).click();


	});






	test.afterAll(async () => {
		await page.goto(process.env.SERVER_LINK);
		await page.getByRole('button', { name: 'User' }).click();
		await page.getByRole('menuitem', { name: /Log out/i }).click();
		await page.close();
	});
});