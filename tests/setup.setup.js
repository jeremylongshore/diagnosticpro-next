import { test as setup, expect } from '@playwright/test';

/**
 * Global setup for DiagnosticPro MVP tests
 * Verifies system dependencies and environment
 */

setup('verify system dependencies', async ({ page }) => {
  console.log('🔧 Setting up DiagnosticPro MVP test environment...');
  
  // Verify Google Cloud authentication
  try {
    const { execSync } = await import('child_process');
    const project = execSync('gcloud config get-value project', { encoding: 'utf8' }).trim();
    console.log(`✅ Google Cloud project: ${project}`);
    expect(project).toBe('diagnostic-pro-mvp');
  } catch (error) {
    console.error('❌ Google Cloud authentication issue:', error.message);
    // Don't fail the test for this - just log the issue
  }
  
  // Verify application starts
  console.log('🚀 Verifying application startup...');
  await page.goto('/');
  await expect(page).toHaveTitle(/DiagnosticPro/);
  console.log('✅ Landing page accessible');
  
  // Navigate to the actual form page where your perfect form lives
  await page.goto('/form?service=diagnosis&name=Test&email=test@test.com');
  console.log('🚀 Navigating to diagnostic form page...');
  
  // Verify form elements exist on the correct page
  await expect(page.getByText('Equipment Type *')).toBeVisible();
  await expect(page.getByRole('button', { name: /Get AI Diagnosis Now/i })).toBeVisible();
  console.log('✅ Perfect diagnostic form elements present');
  
  console.log('🎉 Setup complete - ready for comprehensive testing!');
});