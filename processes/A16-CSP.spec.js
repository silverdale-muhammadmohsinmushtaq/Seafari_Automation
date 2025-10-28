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


	test('Verify the user can create Individual Contact', async () => {
		await page.goto(process.env.SERVER_LINK);
    	await page.getByRole('option', { name: 'Contacts' }).click();
  		await page.getByRole('button', { name: 'New' }).click();
		await page.waitForTimeout(2000);
		await page.getByRole('combobox', { name: 'e.g. Lumber Inc' }).click();
		await page.getByRole('combobox', { name: 'e.g. Lumber Inc' }).fill('**Test Company 001**');
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
		await page.getByRole('button', { name: 'Add' }).click();
		await page.getByRole('radio', { name: 'Invoice Address' }).check();
		await page.getByRole('textbox', { name: 'Contact Name' }).click();
		await page.getByRole('textbox', { name: 'Contact Name' }).fill('**Test Invoice 001**');
		await page.getByRole('textbox', { name: 'Email Email' }).click();
		await page.getByRole('textbox', { name: 'Email Email' }).fill('testInvoice001@Example.com');
		await page.getByRole('textbox', { name: 'Phone Phone' }).click();
		await page.getByRole('textbox', { name: 'Phone Phone' }).fill('12345678999');
		await page.getByRole('textbox', { name: 'Mobile Mobile' }).click();
		await page.getByRole('textbox', { name: 'Mobile Mobile' }).fill('12345678999');
		await page.getByRole('button', { name: 'Save & New' }).click();
		await page.getByRole('radio', { name: 'Delivery Address' }).check();
		await page.getByRole('textbox', { name: 'Contact Name' }).click();
		await page.getByRole('textbox', { name: 'Contact Name' }).fill('**Test Delivery 001**');
		await page.getByRole('textbox', { name: 'Email Email' }).click();
		await page.getByRole('textbox', { name: 'Email Email' }).fill('testDelivery001@Example.com');
		await page.getByRole('textbox', { name: 'Phone Phone' }).click();
		await page.getByRole('textbox', { name: 'Phone Phone' }).fill('12345678999');
		await page.getByRole('textbox', { name: 'Mobile Mobile' }).click();
		await page.getByRole('textbox', { name: 'Mobile Mobile' }).fill('12345678999');
		await page.getByRole('button', { name: 'Save & Close' }).click();
  		await page.getByRole('button', { name: 'Save manually' }).click();
		await page.getByRole('button', { name: 'New' }).click();
		await page.waitForTimeout(2000);
		await page.getByRole('radio', { name: 'Individual' }).check();
		await page.getByRole('textbox', { name: 'e.g. Brandon Freeman' }).click();
		await page.getByRole('textbox', { name: 'e.g. Brandon Freeman' }).fill('**Test Customer 001**');
		await page.locator('#parent_id_0').click();
		await page.locator('#parent_id_0').fill('**Test');
		await page.waitForTimeout(2000);
		await page.getByRole('option', { name: '**Test Company 001**', exact: true }).first().click();
		await page.waitForTimeout(2000);
		await page.getByRole('textbox', { name: 'Job Position' }).click();
		await page.waitForTimeout(2000);
		await page.getByRole('textbox', { name: 'Job Position' }).fill('QA');
		await page.getByRole('textbox', { name: 'Phone' }).click();
		await page.getByRole('textbox', { name: 'Phone' }).fill('12345678999');
		await page.getByRole('textbox', { name: 'Mobile' }).click();
		await page.getByRole('textbox', { name: 'Mobile' }).fill('12345678999');
		await page.getByRole('textbox', { name: 'Email' }).click();
		await page.getByRole('textbox', { name: 'Email' }).fill('testCustomer001@Example.com');
		await page.getByRole('textbox', { name: 'Website' }).click();
		await page.getByRole('textbox', { name: 'Website' }).fill('Testing.com');
		await page.getByRole('combobox', { name: 'Title' }).click();
		await page.getByRole('option', { name: 'Doctor' }).click();
		
		await page.getByRole('button', { name: 'Save manually' }).click();
		await expect.soft(page.locator('body')).toContainText('7842 Big Timber Trail');
	});






	test.afterAll(async () => {
    	await page.goto(process.env.SERVER_LINK);
    	await page.getByRole('button', { name: 'User' }).click();
    	await page.getByRole('menuitem', { name: /Log out/i }).click();
    	await page.close();
	});
});