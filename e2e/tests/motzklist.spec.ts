// e2e/tests/motzklist.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Full System End to End Tests', () => {

  // Test 1: Standard user login
  test('1. User can log in successfully', async ({ page }) => {
    await page.goto('http://localhost:3000/login');
    await page.fill('input[type="email"]', 'student@motzklist.com');
    await page.fill('input[type="password"]', 'student123');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('http://localhost:3000/dashboard');
  });

  // Test 2: Search for a specific book
  test('2. User can search for a book', async ({ page }) => {
    await page.goto('http://localhost:3000/dashboard');
    await page.fill('input[placeholder="Search books..."]', 'Mathematics Grade 10');
    await page.click('button[aria-label="Search"]');
    await expect(page.locator('.book-list')).toContainText('Mathematics Grade 10');
  });

  // Test 3: Add school equipment to reservation cart
  test('3. User can add school equipment to cart', async ({ page }) => {
    await page.goto('http://localhost:3000/equipment');
    await page.click('button[data-testid="add-pencil-case"]');
    await expect(page.locator('.cart-counter')).toHaveText('1');
  });

  // Test 4: Complete the checkout process
  test('4. User can complete a reservation', async ({ page }) => {
    await page.goto('http://localhost:3000/cart');
    await page.click('button:has-text("Checkout")');
    await expect(page.locator('.success-message')).toBeVisible();
  });

  // Test 5: View personal reservation history
  test('5. User can view reservation history', async ({ page }) => {
    await page.goto('http://localhost:3000/profile');
    await page.click('text=My Reservations');
    await expect(page.locator('.reservation-table')).toBeVisible();
  });

  // Test 6: Admin login flow
  test('6. Admin can log in to admin portal', async ({ page }) => {
    await page.goto('http://localhost:3001/login');
    await page.fill('input[type="email"]', 'admin@motzklist.com');
    await page.fill('input[type="password"]', 'admin123');
    await page.click('button[type="submit"]');
    await expect(page.locator('h1')).toContainText('Admin Dashboard');
  });

  // Test 7: Admin adds a new book to the database
  test('7. Admin can add a new book to inventory', async ({ page }) => {
    await page.goto('http://localhost:3001/books/new');
    await page.fill('input[name="title"]', 'History of Israel');
    await page.fill('input[name="author"]', 'Israel Israeli');
    await page.fill('input[name="stock"]', '15');
    await page.click('button:has-text("Save Book")');
    await expect(page.locator('.toast-notification')).toContainText('Book saved');
  });

  // Test 8: Admin updates equipment stock levels
  test('8. Admin can update equipment stock', async ({ page }) => {
    await page.goto('http://localhost:3001/equipment/manage');
    await page.click('button[data-testid="edit-stock-1"]');
    await page.fill('input[name="new-stock"]', '50');
    await page.click('button:has-text("Update")');
    await expect(page.locator('.stock-value').first()).toHaveText('50');
  });

  // Test 9: Admin deletes a book from inventory
  test('9. Admin can delete a book', async ({ page }) => {
    await page.goto('http://localhost:3001/books/manage');
    page.on('dialog', dialog => dialog.accept()); 
    await page.click('button[data-testid="delete-book-1"]');
    await expect(page.locator('.toast-notification')).toContainText('Item deleted');
  });

  // Test 10: Secure logout validation
  test('10. User can log out securely', async ({ page }) => {
    await page.goto('http://localhost:3000/dashboard');
    await page.click('button:has-text("Logout")');
    await expect(page).toHaveURL('http://localhost:3000/login');
  });

});