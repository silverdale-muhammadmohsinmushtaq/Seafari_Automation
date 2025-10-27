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

	test('Verify the user can create "Company" Type contact', async () => {
		await page.goto(process.env.SERVER_LINK);
    	await page.getByRole('option', { name: 'Contacts' }).click();
  		await page.getByRole('button', { name: 'New' }).click();
  		await page.getByRole('radio', { name: 'Company' }).check();
  		await page.getByRole('button', { name: 'Save manually' }).click();
  		// await page.getByRole('textbox', { name: 'e.g. Lumber Inc' }).click();
  		await page.getByRole('textbox', { name: 'e.g. Lumber Inc' }).fill('**Test Company 001**');
  		await page.getByRole('textbox', { name: 'Street...' }).click();
  		await page.getByRole('textbox', { name: 'Street...' }).fill('Test');
  		await page.getByRole('textbox', { name: 'Street 2...' }).click();
  		await page.getByRole('textbox', { name: 'Street 2...' }).fill('testt');
  		await page.getByRole('textbox', { name: 'City' }).click();
  		await page.getByRole('textbox', { name: 'Street 2...' }).fill('testte');
  		await page.getByRole('textbox', { name: 'City' }).fill('test');
  		await page.getByRole('combobox', { name: 'State' }).click();
  		await page.getByRole('combobox', { name: 'Country' }).click();
  		await page.getByRole('combobox', { name: 'Country' }).fill('united sta');
  		await page.getByRole('option', { name: 'United States' }).click();
  		await page.getByRole('combobox', { name: 'State' }).click();
  		await page.getByRole('combobox', { name: 'State' }).fill('wi');
  		await page.getByRole('option', { name: 'Wisconsin (US)' }).click();
  		await page.getByRole('textbox', { name: 'ZIP' }).click();
  		await page.getByRole('textbox', { name: 'ZIP' }).fill('12345');
  		await page.getByRole('textbox', { name: 'Phone' }).click();
  		await page.getByRole('textbox', { name: 'Phone' }).fill('12345678999');
  		await page.getByRole('textbox', { name: 'Mobile' }).click();
  		await page.getByRole('textbox', { name: 'Mobile' }).fill('12345678999');
  		await page.getByRole('textbox', { name: 'Email' }).click();
  		await page.getByRole('textbox', { name: 'Email' }).fill('testCompany001@Example.com');
  		await page.getByRole('textbox', { name: 'Website' }).click();
  		await page.getByRole('textbox', { name: 'Website' }).fill('Testing.com');
  		await page.getByRole('combobox', { name: 'Tags' }).click();
  		await page.getByRole('option', { name: 'Old Private Address' }).click();
  		await page.getByRole('textbox', { name: 'Tax ID?' }).click();
  		await page.getByRole('textbox', { name: 'Tax ID?' }).fill('Tax001');
  		await page.getByRole('button', { name: 'Save manually' }).click();
	});

	test('Verify the user can add "Invoice" Address to Company Address', async () => {
		await page.goto(process.env.SERVER_LINK);
    // Click on 'Sales' module from waffle/dashboard
    await page.getByRole('option', { name: /Sales/i }).click();
    // Expect the Sales screen to be opened
    //await expect(page.getByRole('heading', { name: /Sales/i })).toBeVisible();
	});

	test('Verify the user can add "Delivery" address to Company contact', async () => {
		await page.goto(process.env.SERVER_LINK);
    // Click on 'Sales' module from waffle/dashboard
    await page.getByRole('option', { name: /Sales/i }).click();
    // Expect the Sales screen to be opened
    //await expect(page.getByRole('heading', { name: /Sales/i })).toBeVisible();
	});

	test('Verify the user can create Individual contact and attach company to it', async () => {
		await page.goto(process.env.SERVER_LINK);
    // Click on 'Sales' module from waffle/dashboard
    await page.getByRole('option', { name: /Sales/i }).click();
    // Expect the Sales screen to be opened
    //await expect(page.getByRole('heading', { name: /Sales/i })).toBeVisible();
	});

	test('Verify that, When a user adds the desired information in the tags', async () => {
		await page.goto(process.env.SERVER_LINK);
    // Click on 'Sales' module from waffle/dashboard
    await page.getByRole('option', { name: /Sales/i }).click();
    // Expect the Sales screen to be opened
    //await expect(page.getByRole('heading', { name: /Sales/i })).toBeVisible();
	});


	test('Verify that Tax ID could be added in the Contact form', async () => {
		await page.goto(process.env.SERVER_LINK);
    // Click on 'Sales' module from waffle/dashboard
    await page.getByRole('option', { name: /Sales/i }).click();
    // Expect the Sales screen to be opened
    //await expect(page.getByRole('heading', { name: /Sales/i })).toBeVisible();
	});


	test('Verify that, When user Click on Sales and Purchase then', async () => {
		await page.goto(process.env.SERVER_LINK);
    // Click on 'Sales' module from waffle/dashboard
    await page.getByRole('option', { name: /Sales/i }).click();
    // Expect the Sales screen to be opened
    //await expect(page.getByRole('heading', { name: /Sales/i })).toBeVisible();
	});

	test('Verify that, In the Sales Section user select the sales person from the dropdown then', async () => {
		await page.goto(process.env.SERVER_LINK);
    // Click on 'Sales' module from waffle/dashboard
    await page.getByRole('option', { name: /Sales/i }).click();
    // Expect the Sales screen to be opened
    //await expect(page.getByRole('heading', { name: /Sales/i })).toBeVisible();
	});

	test('Verify that, In the Sales Section user selects the payment terms from the dropdown then1', async () => {
		await page.goto(process.env.SERVER_LINK);
    // Click on 'Sales' module from waffle/dashboard
    await page.getByRole('option', { name: /Sales/i }).click();
    // Expect the Sales screen to be opened
    //await expect(page.getByRole('heading', { name: /Sales/i })).toBeVisible();
	});

	test('Verify that, In the Sales Section user selects the Price list from the dropdown then2', async () => {
		await page.goto(process.env.SERVER_LINK);
    // Click on 'Sales' module from waffle/dashboard
    await page.getByRole('option', { name: /Sales/i }).click();
    // Expect the Sales screen to be opened
    //await expect(page.getByRole('heading', { name: /Sales/i })).toBeVisible();
	});

	test('Verify that, In the Sales Section user selects the delivery method from the dropdown then3', async () => {
		await page.goto(process.env.SERVER_LINK);
    // Click on 'Sales' module from waffle/dashboard
    await page.getByRole('option', { name: /Sales/i }).click();
    // Expect the Sales screen to be opened
    //await expect(page.getByRole('heading', { name: /Sales/i })).toBeVisible();
	});

	test('Verify that, When user enter all the required information and click on save button then4', async () => {
		await page.goto(process.env.SERVER_LINK);
    // Click on 'Sales' module from waffle/dashboard
    await page.getByRole('option', { name: /Sales/i }).click();
    // Expect the Sales screen to be opened
    //await expect(page.getByRole('heading', { name: /Sales/i })).toBeVisible();
	});

	test('Verify that, In case when the customer is an Individual and separate entity then the user should select the Individual Radio button5', async () => {
		await page.goto(process.env.SERVER_LINK);
    // Click on 'Sales' module from waffle/dashboard
    await page.getByRole('option', { name: /Sales/i }).click();
    // Expect the Sales screen to be opened
    //await expect(page.getByRole('heading', { name: /Sales/i })).toBeVisible();
	});

	test('Verify that, When a user adds the desired information in the tags5', async () => {
		await page.goto(process.env.SERVER_LINK);
    // Click on 'Sales' module from waffle/dashboard
    await page.getByRole('option', { name: /Sales/i }).click();
    // Expect the Sales screen to be opened
    //await expect(page.getByRole('heading', { name: /Sales/i })).toBeVisible();
	});

	test('Verify that, When user Click on Sales and Purchase then7', async () => {
		await page.goto(process.env.SERVER_LINK);
    // Click on 'Sales' module from waffle/dashboard
    await page.getByRole('option', { name: /Sales/i }).click();
    // Expect the Sales screen to be opened
    //await expect(page.getByRole('heading', { name: /Sales/i })).toBeVisible();
	});

	test('Verify that, In the Sales Section user select the sales person from the dropdown then8', async () => {
		await page.goto(process.env.SERVER_LINK);
    // Click on 'Sales' module from waffle/dashboard
    await page.getByRole('option', { name: /Sales/i }).click();
    // Expect the Sales screen to be opened
    //await expect(page.getByRole('heading', { name: /Sales/i })).toBeVisible();
	});

	test('Verify that, In the Sales Section user selects the Price list from the dropdown then9', async () => {
		await page.goto(process.env.SERVER_LINK);
    // Click on 'Sales' module from waffle/dashboard
    await page.getByRole('option', { name: /Sales/i }).click();
    // Expect the Sales screen to be opened
    //await expect(page.getByRole('heading', { name: /Sales/i })).toBeVisible();
	});

	test('Verify that, In the Sales Section user selects the delivery method from the dropdown then10', async () => {
		await page.goto(process.env.SERVER_LINK);
    // Click on 'Sales' module from waffle/dashboard
    await page.getByRole('option', { name: /Sales/i }).click();
    // Expect the Sales screen to be opened
    //await expect(page.getByRole('heading', { name: /Sales/i })).toBeVisible();
	});

	test('Verify that, When user enter all the required information and click on save button then11', async () => {
		await page.goto(process.env.SERVER_LINK);
    // Click on 'Sales' module from waffle/dashboard
    await page.getByRole('option', { name: /Sales/i }).click();
    // Expect the Sales screen to be opened
    //await expect(page.getByRole('heading', { name: /Sales/i })).toBeVisible();
	});

	test('Verify that, When a user adds the desired information in Website then12', async () => {
		await page.goto(process.env.SERVER_LINK);
    // Click on 'Sales' module from waffle/dashboard
    await page.getByRole('option', { name: /Sales/i }).click();
    // Expect the Sales screen to be opened
    //await expect(page.getByRole('heading', { name: /Sales/i })).toBeVisible();
	});

	test('Verify that, In the Sales Section user select the sales person from the dropdown then13', async () => {
		await page.goto(process.env.SERVER_LINK);
    // Click on 'Sales' module from waffle/dashboard
    await page.getByRole('option', { name: /Sales/i }).click();
    // Expect the Sales screen to be opened
    //await expect(page.getByRole('heading', { name: /Sales/i })).toBeVisible();
	});

	test('Verify that, In the Sales Section user selects the payment terms from the dropdown then14', async () => {
		await page.goto(process.env.SERVER_LINK);
    // Click on 'Sales' module from waffle/dashboard
    await page.getByRole('option', { name: /Sales/i }).click();
    // Expect the Sales screen to be opened
    //await expect(page.getByRole('heading', { name: /Sales/i })).toBeVisible();
	});

	test('Verify that, In the Sales Section user selects the Price list from the dropdown then15', async () => {
		await page.goto(process.env.SERVER_LINK);
    // Click on 'Sales' module from waffle/dashboard
    await page.getByRole('option', { name: /Sales/i }).click();
    // Expect the Sales screen to be opened
    //await expect(page.getByRole('heading', { name: /Sales/i })).toBeVisible();
	});

	test('Verify that, In the Sales Section user selects the delivery method from the dropdown then16', async () => {
		await page.goto(process.env.SERVER_LINK);
    // Click on 'Sales' module from waffle/dashboard
    await page.getByRole('option', { name: /Sales/i }).click();
    // Expect the Sales screen to be opened
    //await expect(page.getByRole('heading', { name: /Sales/i })).toBeVisible();
	});



	test.afterAll(async () => {
    	await page.goto(process.env.SERVER_LINK);
    	await page.getByRole('button', { name: 'User' }).click();
    	await page.getByRole('menuitem', { name: /Log out/i }).click();
    	await page.close();
	});
});

