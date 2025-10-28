require('dotenv').config();
const { test, expect } = require('@playwright/test');

test.describe('Appointment Booking Flow', () => {
	test('Verify the user can create an appointment using website', async ({ page }) => {
		// Navigate to the website
		await page.goto('https://seafari-stlucia-do-not-drop-phase-01-21136937.dev.odoo.com/');
		
		// Click on Appointment menu
		await page.getByRole('menuitem', { name: 'Appointment' }).click();
		
		// Select number of people
		await page.getByLabel('Number of people').selectOption('2');
		
		// Wait for time slots to load
		await page.waitForSelector('button:has-text("12:30 PM")', { timeout: 10000 });
		
		// Select a time slot (12:30 PM)
		await page.getByRole('button', { name: '12:30 PM' }).click();
		
		// Confirm the selection (table/resource selection)
		await page.getByRole('button', { name: 'Confirm' }).click();
		
		// Fill in customer details
		await page.getByRole('textbox', { name: 'e.g. John Smith' }).fill('John Smith');
		await page.getByRole('textbox', { name: 'e.g. john.smith@example.com' }).fill('john.smith@example.com');
		await page.getByRole('textbox', { name: 'e.g. +1(605)691-' }).fill('+1(605)691-3277');
		
		// Proceed to payment
		await page.getByRole('button', { name: 'Proceed to Payment' }).click();
		
		// Verify shopping cart page loaded with appointment
		await expect.soft(page).toHaveURL(/\/shop\/cart/);
		await expect.soft(page.locator('body')).toContainText('Booking Fees');
		await expect.soft(page.locator('body')).toContainText('40.00 $$');
		
		// Pay with Demo
		await page.getByRole('button', { name: 'Pay with Demo' }).click();
		
		// Complete demo payment
		await page.getByRole('button', { name: 'Pay', exact: true }).click();
		
		// Wait for payment status page
		await page.waitForURL(/\/payment\/status/);
		
		// Verify payment success
		await expect.soft(page.locator('body')).toContainText('Your payment has been successfully processed.');
		await expect.soft(page.locator('body')).toContainText('40.00 $$');
		await expect.soft(page.locator('body')).toContainText('Reference');
		
		// Verify appointment details in cart count (should show items)
		const cartBadge = page.locator('a[href="/shop/cart"] superscript');
		await expect.soft(cartBadge).toBeVisible();
	});
});

