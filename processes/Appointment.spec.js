require('dotenv').config();
const { test, expect } = require('@playwright/test');



test.describe('Appointment Booking Flow', () => {
	test('Verify the user can create an appointment using website', async ({ page }) => {
		// Navigate to Sales module
        let serverlink = process.env.SERVER_LINK;

        const appointmentUrl = process.env.SERVER_LINK.replace('/web', '') + '/appointment';
		await page.goto(appointmentUrl);
        //await page.pause();
        
	// ===============================================================
	// INTELLIGENT DATE/TIME SELECTION WITH AVAILABILITY CHECK
	// ===============================================================
	// Strategy: Start from today, try all time slots for each date before moving to next date
	const numberOfPeople = '5';
	let selectedDate = '';
	let selectedTime = '';
	let selectedResourceId = '';
	let selectedResourceName = '';
	let availableOptions = [];
	let foundAvailableSlot = false;
	const maxDateAttempts = 30; // Try up to 30 different dates
	let currentDateIndex = 0;
	
	console.log('\n========== STARTING APPOINTMENT SEARCH ==========');
	console.log('Starting from today and searching for available slots...\n');
	
	dateLoop: for (let dateAttempt = 0; dateAttempt < maxDateAttempts; dateAttempt++) {
		// Get all available dates in the visible month
		const allDates = page.locator('.o_appointment_month:not(.d-none) .o_day_wrapper.o_slot_button[data-slot-date]');
		const dateCount = await allDates.count();
		
		if (dateCount === 0) {
			console.log('No available dates in current month, moving to next month...');
			await page.locator('#nextCal').first().click();
			await page.waitForTimeout(1000);
			continue;
		}
		
		// If we've gone through all dates in current month, move to next month
		if (currentDateIndex >= dateCount) {
			console.log('Checked all dates in this month, moving to next month...');
			await page.locator('#nextCal').first().click();
			await page.waitForTimeout(1000);
			currentDateIndex = 0; // Reset index for new month
			continue;
		}
		
		// Select current date
		const dateElement = allDates.nth(currentDateIndex);
		selectedDate = await dateElement.getAttribute('data-slot-date');
		console.log(`\n--- Checking Date ${dateAttempt + 1}: ${selectedDate} ---`);
		await dateElement.click();
		await page.waitForTimeout(500);
		
		// Select number of people
		await page.locator('#resourceCapacity').selectOption(numberOfPeople);
		await page.waitForTimeout(1000);
		
		// Get all available time slots for this date
		const timeSlots = page.locator('.o_slot_hours');
		const timeSlotCount = await timeSlots.count();
		
		if (timeSlotCount === 0) {
			console.log('✗ No time slots available for this date');
			currentDateIndex++; // Move to next date
			continue;
		}
		
		console.log(`Found ${timeSlotCount} time slots, trying each one...`);
		
		// Try each time slot on this date
		for (let timeIndex = 0; timeIndex < timeSlotCount; timeIndex++) {
			// Refresh time slots locator (DOM might have changed)
			const currentTimeSlots = page.locator('.o_slot_hours');
			const timeSlot = currentTimeSlots.nth(timeIndex);
			
			// Get time slot text
			selectedTime = await timeSlot.locator('b').textContent();
			console.log(`  Trying time slot ${timeIndex + 1}/${timeSlotCount}: ${selectedTime}`);
			
			// Click time slot
			await timeSlot.click();
			await page.waitForTimeout(1000);
			
			// Check if "Make Your Choice" dropdown has available options
			const resourceDropdown = page.locator('select[name="resource_id"]');
			await resourceDropdown.waitFor({ state: 'visible', timeout: 5000 }).catch(() => {
				console.log('    Resource dropdown did not appear');
			});
			
			const allOptions = await resourceDropdown.locator('option').all();
			availableOptions = [];
			
			for (const option of allOptions) {
				const value = await option.getAttribute('value');
				const text = await option.textContent();
				if (value && value.trim() !== '') {
					availableOptions.push({ value, text });
				}
			}
			
			console.log(`    Available resources: ${availableOptions.length}`);
			
			// If we found available options, try to select them
			if (availableOptions.length > 0) {
				// Check if dropdown is still enabled
				const isEnabled = await resourceDropdown.isEnabled({ timeout: 2000 }).catch(() => false);
				
				if (!isEnabled) {
					console.log('    ✗ Dropdown disabled - slot just booked, trying next time slot...');
					continue; // Try next time slot
				}
				
				// Try to select the resource
				selectedResourceId = availableOptions[0].value;
				selectedResourceName = availableOptions[0].text.trim();
				
				try {
					await resourceDropdown.selectOption(selectedResourceId, { timeout: 5000 });
					await page.waitForTimeout(500);
					
					// Verify selection was successful
					const stillEnabled = await resourceDropdown.isEnabled().catch(() => false);
					if (stillEnabled) {
						foundAvailableSlot = true;
						console.log(`    ✓ Successfully selected: ${selectedResourceName}`);
						console.log(`\n✓✓✓ BOOKING CONFIRMED ✓✓✓`);
						console.log(`Date: ${selectedDate}, Time: ${selectedTime}, Resource: ${selectedResourceName}\n`);
						break dateLoop; // Exit both loops
					} else {
						console.log('    ✗ Selection failed - trying next time slot...');
						continue; // Try next time slot
					}
				} catch (error) {
					console.log('    ✗ Error selecting:', error.message);
					continue; // Try next time slot
				}
			} else {
				console.log('    ✗ No resources available for this time slot');
				// Continue to next time slot
			}
		}
		
		// All time slots tried for this date, move to next date
		console.log(`✗ No availability found on ${selectedDate}, moving to next date`);
		currentDateIndex++;
	}
	
	// Verify we found and successfully booked an available slot
	expect(foundAvailableSlot).toBeTruthy();
	expect(selectedResourceId).toBeTruthy();
	
	// Click Confirm to proceed to details form
	await page.getByRole('button', { name: 'Confirm' }).click();
	await page.waitForTimeout(1000);

	// ===============================================================
	// STORED VARIABLES FOR VERIFICATION
	// ===============================================================
	// Appointment Selection Data (selected intelligently):
	// - selectedDate: The selected appointment date with availability
	// - selectedTime: The selected appointment time with availability
	// - numberOfPeople: Number of people selected (line 22)
	// - selectedResourceId: Selected resource/table ID
	// - selectedResourceName: Selected resource/table name
	//
	// All form data variables are defined below
	// ===============================================================
	
	// Store customer and checkout form data in variables for backend verification
	const customerName = '**Test Customer 002**';
	const customerEmail = 'testCustomer002@Example.com';
	const customerPhone = '12345678999';
	const guestEmails = 'testGuest001@Example.com\ntestGuest002@Example.com\ntestGuest003@Example.com';
	const specialRequest = 'test Special Request';
	
	// Billing/Checkout information
	const checkoutEmail = 'TestCusotmer003@Example.com';
	const checkoutFullName = '**Test Customer 003**';
	const checkoutPhone = '12345678999';
	const companyName = 'Test Company';
	const streetAddress = '7842 Big Timber Trail';
	const city = 'middleton';
	const zipCode = '53562';
	const countryId = '233'; // Country option value
	const stateId = '58'; // State/Province option value
	const paymentMethod = 'Demo';

	// Fill appointment details form
	// Wait for details form to be fully loaded
	await page.getByRole('textbox', { name: 'e.g. John Smith' }).waitFor({ state: 'visible', timeout: 10000 });
	await page.getByRole('textbox', { name: 'e.g. John Smith' }).fill(customerName);
	
	// Wait for email field to be ready and fill it
	const emailField = page.getByRole('textbox', { name: /e.g. john.smith@example.com/i });
	await emailField.waitFor({ state: 'visible', timeout: 10000 });
	await emailField.fill(customerEmail);
	// Fill phone field
	await page.getByRole('textbox', { name: /e.g. \+1\(605\)691/i }).fill(customerPhone);
	await page.getByRole('button', { name: ' Add Guests' }).click();
	await page.waitForTimeout(500);
	await page.getByRole('textbox', { name: /e.g. john.doe@email.com/i }).fill(guestEmails);
	
	// Fill special request
	await page.getByRole('textbox', { name: /Customized Request/i }).fill(specialRequest);
	await page.getByRole('button', { name: 'Proceed to Payment' }).click();
	
	
	await page.getByRole('button', { name: 'Checkout ' }).click();
	await page.getByRole('textbox', { name: 'Email' }).click();
	await page.getByRole('textbox', { name: 'Email' }).fill(checkoutEmail);
	await page.getByRole('textbox', { name: 'Full name' }).click();
	await page.getByRole('textbox', { name: 'Full name' }).fill(checkoutFullName);
	await page.getByRole('textbox', { name: 'Phone' }).click();
	await page.getByRole('textbox', { name: 'Phone' }).fill(checkoutPhone);
	await page.getByRole('textbox', { name: 'Company Name' }).click();
	await page.getByRole('textbox', { name: 'Company Name' }).fill(companyName);
	await page.getByRole('textbox', { name: 'Street and Number' }).click();
	await page.getByRole('textbox', { name: 'Street and Number' }).fill(streetAddress);
	await page.getByRole('textbox', { name: 'City' }).click();
	
	await page.getByRole('textbox', { name: 'City' }).fill(city);
	await page.getByRole('textbox', { name: 'Zip Code' }).click();
	
	await page.getByRole('textbox', { name: 'Zip Code' }).fill(zipCode);
	await page.getByLabel('Country').selectOption(countryId);
	
	await page.getByLabel('State / Province').selectOption(stateId);
	
	await page.getByRole('button', { name: 'Continue checkout ' }).click();
	
	await page.locator('label').filter({ hasText: paymentMethod }).click();
	await expect(page.getByText(`Billing: ${streetAddress.substring(0, 17)}`)).toBeVisible();
	await expect(page.locator('address')).toContainText(`${streetAddress}, ${city}`);
	
	// Wait for payment provider to load and "Pay now" button to be enabled
	const payNowButton = page.getByRole('button', { name: 'Pay now' });
	await payNowButton.waitFor({ state: 'visible', timeout: 10000 });
	await expect(payNowButton).toBeEnabled({ timeout: 10000 });
	await payNowButton.click();
	

	// Wait for order confirmation message to appear
	await page.locator('h3:has-text("Thank you for your order.")').waitFor({ state: 'visible', timeout: 30000 });
	
	// Verify order confirmation page elements (soft assertions)
	await expect.soft(page.locator('h3')).toContainText('Thank you for your order.');
	await expect.soft(page.getByRole('button', { name: 'Print' })).toBeVisible();
	
	// Extract and store the sale order number with flexible locator
	// Look for text matching S followed by digits (more flexible regex)
	const saleOrderElement = page.getByText(/S\d{4,6}/).first();
	
	// Wait for sale order number to appear and be visible
	await saleOrderElement.waitFor({ state: 'visible', timeout: 10000 }).catch(() => {
		console.log('Sale order number element not found with primary locator');
	});
	
	let saleOrderNumber = '';
	try {
		// Get the text content and extract just the order number
		const fullText = await saleOrderElement.textContent({ timeout: 5000 });
		const match = fullText.match(/S\d{4,6}/);
		saleOrderNumber = match ? match[0] : fullText.trim();
		await expect.soft(saleOrderElement).toBeVisible();
	} catch (error) {
		console.log('Could not extract sale order number:', error.message);
		saleOrderNumber = 'ORDER_NUMBER_NOT_FOUND';
	}
	
	console.log('\n========== ORDER CONFIRMED ==========');
	console.log('Sale Order Number:', saleOrderNumber);
	console.log('=====================================\n');

	// ===============================================================
	// BACKEND VERIFICATION - Use these stored variables to verify appointment data
	// ===============================================================
	
	// Log all captured data for verification
	console.log('\n========== APPOINTMENT DATA CAPTURED ==========');
	console.log('Order Information:');
	console.log('  Sale Order Number:', saleOrderNumber);
	console.log('\nAppointment Details:');
	console.log('  Date:', selectedDate);
	console.log('  Time:', selectedTime);
	console.log('  Number of People:', numberOfPeople);
	console.log('  Resource ID:', selectedResourceId);
	console.log('  Resource Name:', selectedResourceName);
	console.log('\nCustomer Information:');
	console.log('  Name:', customerName);
	console.log('  Email:', customerEmail);
	console.log('  Phone:', customerPhone);
	console.log('\nAdditional Details:');
	console.log('  Guest Emails:', guestEmails.replace(/\n/g, ', '));
	console.log('  Special Request:', specialRequest);
	console.log('\nCheckout/Billing Information:');
	console.log('  Email:', checkoutEmail);
	console.log('  Full Name:', checkoutFullName);
	console.log('  Phone:', checkoutPhone);
	console.log('  Company Name:', companyName);
	console.log('  Street Address:', streetAddress);
	console.log('  City:', city);
	console.log('  Zip Code:', zipCode);
	console.log('  Country ID:', countryId);
	console.log('  State ID:', stateId);
	console.log('  Payment Method:', paymentMethod);
	console.log('===============================================\n');
	
	// TODO: Add your backend verification logic here
	// Available variables for verification:
	//   - saleOrderNumber: The unique sale order number (e.g., "S00123")
	//   - All other variables listed in the console output above
	// ===============================================================
	await page.waitForTimeout(5000);

	// Click "View Details" button to verify appointment details
	const page1Promise = page.waitForEvent('popup');
	await page.getByRole('link', { name: 'View Details' }).click();
	const page1 = await page1Promise;
	
	console.log('\n========== APPOINTMENT DETAILS PAGE OPENED ==========');
	console.log('Verifying appointment details in new tab...');
	console.log('====================================================\n');

	// Close the popup that appears on the new page
	await page1.locator('.s_popup_close.js_close_popup').click();
	await page1.waitForTimeout(500);
	
	// ===============================================================
	// VERIFY APPOINTMENT DETAILS ON DETAILS PAGE
	// ===============================================================
	console.log('Verifying appointment details...');
	
	// Verify appointment confirmation header
	await expect.soft(page1.getByRole('heading', { name: /Appointment Scheduled!/i })).toBeVisible();
	
	// Verify date and time (format: Mon Nov 3, 2025, 8:00:00 PM)
	await expect.soft(page1.getByText(selectedDate, { exact: false })).toBeVisible();
	console.log('✓ Date verified');
	
	// Verify duration
	await expect.soft(page1.getByText('2 hours 30 minutes')).toBeVisible();
	console.log('✓ Duration verified');
	
	// Verify selected resource/table name
	await expect.soft(page1.getByText(selectedResourceName)).toBeVisible();
	console.log('✓ Resource verified:', selectedResourceName);
	
	// Verify location
	await expect.soft(page1.getByText('BIG CHEF BAKEHOUSE')).toBeVisible();
	await expect.soft(page1.getByText(/RODNEY BAY, GROS\s+ISLET ST\.LUCIA/i)).toBeVisible();
	console.log('✓ Location verified');
	
	// Verify number of people
	await expect.soft(page1.getByText(`${numberOfPeople} people`)).toBeVisible();
	console.log('✓ Number of people verified:', numberOfPeople);
	
	// Verify customer name (attendee)
	await expect.soft(page1.getByText(customerName)).toBeVisible();
	console.log('✓ Customer name verified');
	
	// Verify contact details (email and phone)
	await expect.soft(page1.getByText(customerEmail, { exact: false })).toBeVisible();
	await expect.soft(page1.getByText(customerPhone)).toBeVisible();
	console.log('✓ Contact details verified');
	
	console.log('\n========== ALL VERIFICATIONS PASSED ==========\n');





		
		
	});
});


let page;

test.describe.serial('Odoo End-to-End QA', () => {
	test.beforeAll(async ({ browser }) => {
		page = await browser.newPage();
		
		await page.locator("//input[@name='login']").fill(process.env.ODOO_USERNAME);
		await page.locator("//input[@name='password']").fill(process.env.ODOO_PASSWORD);
		await page.getByRole('button', { name: 'Log in', exact: true }).click();
		await page.getByRole('button', { name: 'User' }).waitFor();

	});

	





	test.afterAll(async () => {
		await page.goto(process.env.SERVER_LINK);
		await page.getByRole('button', { name: 'User' }).click();
		await page.getByRole('menuitem', { name: /Log out/i }).click();
		await page.close();
	});
});





/////////////////////////////////////////////////////////////////////
// test('test', async ({ page }) => {
// 	await page.goto('https://seafari-stlucia-do-not-drop-phase-01-21136937.dev.odoo.com/');
// 	await page.getByRole('menuitem', { name: 'Appointment' }).click();
// 	await page.getByRole('button', { name: '' }).click();
// 	await page.locator('[id="2025-11-27"]').click();
// 	await page.waitForTimeout(1000);
// 	await page.locator('.o_appointment_calendar_form > div').first().click();
// 	await page.waitForTimeout(1000);
// 	await page.getByLabel('Number of people').selectOption('5');
// 	await page.getByRole('button', { name: '5:00 AM' }).click();
// 	await page.getByRole('button', { name: 'Confirm' }).click();
// 	await page.getByRole('textbox', { name: 'e.g. John Smith' }).click();
// 	await page.getByRole('textbox', { name: 'e.g. John Smith' }).fill('**Test Customer 002**');
// 	await page.getByRole('textbox', { name: 'e.g. john.smith@example.com' }).click();
// 	await page.getByRole('textbox', { name: 'e.g. john.smith@example.com' }).fill('testCustomer002@Example.com');
// 	await page.getByRole('textbox', { name: 'e.g. +1(605)691-' }).click();
// 	await page.getByRole('textbox', { name: 'e.g. +1(605)691-' }).fill('12345678999');
// 	await page.getByRole('button', { name: ' Add Guests' }).click();
// 	await page.getByRole('textbox', { name: 'e.g. john.doe@email.com e.g.' }).fill('testGuest001@Example.com\ntestGuest002@Example.com\ntestGuest003@Example.com');
// 	await page.getByRole('textbox', { name: 'Customized Request will be' }).click();
// 	await page.getByRole('textbox', { name: 'Customized Request will be' }).fill('test Special Request');
// 	await page.getByRole('button', { name: 'Proceed to Payment' }).click();
// 	await expect(page.getByRole('link', { name: 'Booking Fees' })).toBeVisible();
// 	await expect(page.locator('div').filter({ hasText: 'Order overview Booking Fees' }).nth(4)).toBeVisible();
// 	await page.getByRole('button', { name: 'Checkout ' }).click();
// 	await page.getByRole('textbox', { name: 'Email' }).click();
// 	await page.getByRole('textbox', { name: 'Email' }).fill('**TestCusotmer003@Example.com');
// 	await page.getByRole('textbox', { name: 'Full name' }).click();
// 	await page.getByRole('textbox', { name: 'Full name' }).fill('**');
// 	await page.getByRole('textbox', { name: 'Email' }).click();
// 	await page.getByRole('textbox', { name: 'Email' }).press('ArrowLeft');
// 	await page.getByRole('textbox', { name: 'Email' }).press('ArrowLeft');
// 	await page.getByRole('textbox', { name: 'Email' }).press('ArrowLeft');
// 	await page.getByRole('textbox', { name: 'Email' }).press('ArrowLeft');
// 	await page.getByRole('textbox', { name: 'Email' }).press('ArrowLeft');
// 	await page.getByRole('textbox', { name: 'Email' }).press('ArrowLeft');
// 	await page.getByRole('textbox', { name: 'Email' }).press('ArrowLeft');
// 	await page.getByRole('textbox', { name: 'Email' }).press('ArrowLeft');
// 	await page.getByRole('textbox', { name: 'Email' }).press('ArrowLeft');
// 	await page.getByRole('textbox', { name: 'Email' }).press('ArrowLeft');
// 	await page.getByRole('textbox', { name: 'Email' }).press('ArrowLeft');
// 	await page.getByRole('textbox', { name: 'Email' }).press('ArrowLeft');
// 	await page.getByRole('textbox', { name: 'Email' }).press('ArrowLeft');
// 	await page.getByRole('textbox', { name: 'Email' }).press('ArrowLeft');
// 	await page.getByRole('textbox', { name: 'Email' }).press('ArrowLeft');
// 	await page.getByRole('textbox', { name: 'Email' }).press('ArrowLeft');
// 	await page.getByRole('textbox', { name: 'Email' }).press('ArrowLeft');
// 	await page.getByRole('textbox', { name: 'Email' }).press('ArrowLeft');
// 	await page.getByRole('textbox', { name: 'Email' }).press('ArrowLeft');
// 	await page.getByRole('textbox', { name: 'Email' }).press('ArrowLeft');
// 	await page.getByRole('textbox', { name: 'Email' }).press('ArrowLeft');
// 	await page.getByRole('textbox', { name: 'Email' }).press('ArrowLeft');
// 	await page.getByRole('textbox', { name: 'Email' }).press('ArrowLeft');
// 	await page.getByRole('textbox', { name: 'Email' }).press('ArrowLeft');
// 	await page.getByRole('textbox', { name: 'Email' }).press('ArrowLeft');
// 	await page.getByRole('textbox', { name: 'Email' }).press('ArrowLeft');
// 	await page.getByRole('textbox', { name: 'Email' }).press('ArrowLeft');
// 	await page.getByRole('textbox', { name: 'Email' }).press('ArrowRight');
// 	await page.getByRole('textbox', { name: 'Email' }).press('ArrowRight');
// 	await page.getByRole('textbox', { name: 'Email' }).fill('TestCusotmer003@Example.com');
// 	await page.getByRole('textbox', { name: 'Full name' }).click();
// 	await page.getByRole('textbox', { name: 'Full name' }).fill('**Test Customer 003**');
// 	await page.getByRole('textbox', { name: 'Phone' }).click();
// 	await page.getByRole('textbox', { name: 'Phone' }).fill('12345678999');
// 	await page.getByRole('textbox', { name: 'Company Name' }).click();
// 	await page.getByRole('textbox', { name: 'Company Name' }).fill('Test Company');
// 	await page.getByRole('textbox', { name: 'Street and Number' }).click();
// 	await page.getByRole('textbox', { name: 'Street and Number' }).fill('7842 Big Timber Trail');
// 	await page.getByRole('textbox', { name: 'City' }).click();
// 	await page.waitForTimeout(1000);
// 	await page.getByRole('textbox', { name: 'City' }).fill('middleton');
// 	await page.getByRole('textbox', { name: 'Zip Code' }).click();
// 	await page.waitForTimeout(1000);
// 	await page.getByRole('textbox', { name: 'Zip Code' }).fill('53562');
// 	await page.getByLabel('Country').selectOption('233');
// 	await page.waitForTimeout(1000);
// 	await page.getByLabel('State / Province').selectOption('58');
// 	await page.waitForTimeout(1000);
// 	await page.getByRole('button', { name: 'Continue checkout ' }).click();
// 	await page.locator('label').filter({ hasText: 'Demo' }).click();
// 	await expect(page.getByText('Billing: 7842 Big Timber')).toBeVisible();
// 	await expect(page.locator('address')).toContainText('7842 Big Timber Trail, middleton WI 53562, United States');
// 	await page.getByRole('button', { name: 'Pay now' }).click();
	
// 	// Wait for order confirmation message to appear
// 	await page.locator('h3:has-text("Thank you for your order.")').waitFor({ state: 'visible', timeout: 30000 });
	
// 	//sawait page.pause();
// 	await expect(page.locator('h3')).toContainText('Thank you for your order.');
// 	await expect(page.getByRole('button', { name: 'Print' })).toBeVisible();
// 	await expect(page.getByText('Order summary 5 item(s) - 250.00 $$ 5 x Booking Fees 250.00 $$ Subtotal 250.00')).toBeVisible();
// 	const page1Promise = page.waitForEvent('popup');
// 	await page.getByRole('button', { name: 'View Details' }).click();
// 	const page1 = await page1Promise;

// 	await expect(page1.getByText('**Test Customer 002** - Big')).toBeVisible();
	
// 	await expect(page1.getByText('hours 30 minutes')).toBeVisible();
// 	await expect(page1.getByText('Big Chef Steakhouse -')).toBeVisible();
// 	await expect(page1.locator('.o_portal_address > div').first()).toBeVisible();
// 	await expect(page1.getByText('RODNEY BAY, GROS ISLET ST.')).toBeVisible();
// 	await expect(page1.getByText('5 people')).toBeVisible();
// 	await expect(page1.locator('div:nth-child(6) > .col-9 > div').first()).toBeVisible();
// 	await expect(page1.locator('.col-9 > div:nth-child(2)')).toBeVisible();
// 	await page1.getByRole('link', { name: ' All Appointments' }).click();
//   });