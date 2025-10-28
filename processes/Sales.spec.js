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
    //Veriy user can create and confirm sale quotation
	test('Verify the user can create and confirm Sale Quotation', async () => {
		// Navigate to Sales module
		await page.goto(process.env.SERVER_LINK);
		await page.getByRole('option', { name: 'Sales' }).click();
		
		// Create new quotation
		await page.getByRole('button', { name: 'New' }).click();
		await page.waitForTimeout(2000);
		
		// Select customer
		await page.getByPlaceholder('Search Customer').click();
		await page.getByPlaceholder('Search Customer').fill('**Test Company 001**');
		await page.waitForTimeout(1000);
		await page.getByRole('option', { name: '**Test Company 001**' }).first().click();
		
		// Add order line - click Add a product
		await page.getByRole('button', { name: 'Add a product' }).click();
		await page.waitForTimeout(1000);
		
		// Select product
		const productField = page.locator('input[name="product_id"]').first();
		await productField.click();
		await productField.fill('All-purpose Flour');
		await page.waitForTimeout(1000);
		await page.getByRole('option', { name: 'All-purpose Flour' }).first().click();
		
		// Set quantity
		await page.locator('input[name="product_uom_qty"]').first().click();
		await page.locator('input[name="product_uom_qty"]').first().fill('5');
		
		// Click outside to trigger calculation
		await page.getByRole('heading', { name: 'Quotation' }).click();
		await page.waitForTimeout(1000);
		
		// Save the quotation
		await page.getByRole('button', { name: 'Save manually' }).click();
		await page.waitForTimeout(2000);
		
		// Verify quotation is in draft state
		await expect.soft(page.locator('body')).toContainText('Quotation');
		
		// Confirm the quotation
		await page.getByRole('button', { name: 'Confirm' }).click();
		await page.waitForTimeout(2000);
		
		// Verify quotation is confirmed (status changed to Sales Order)
		await expect.soft(page.locator('body')).toContainText('Sales Order');
		await expect.soft(page.getByRole('button', { name: 'Create Invoice' })).toBeVisible();
		
		// Verify customer details are present
		await expect.soft(page.locator('body')).toContainText('**Test Company 001**');
		
		// Verify product is in the order lines
		await expect.soft(page.locator('body')).toContainText('All-purpose Flour');
	});






	test.afterAll(async () => {
		await page.goto(process.env.SERVER_LINK);
		await page.getByRole('button', { name: 'User' }).click();
		await page.getByRole('menuitem', { name: /Log out/i }).click();
		await page.close();
	});
});