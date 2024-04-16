import { test, expect } from '@grafana/plugin-e2e';
import { TEST_IDS } from '../src/constants';

test.describe('Volkovlabs Calendar Panel', () => {
  test('Should display a Calendar', async ({
    readProvisionedDashboard,
    gotoDashboardPage,
    page,
    gotoPanelEditPage,
  }) => {
    /**
     * Use panels.json dashboard
     */
    const dashboard = await readProvisionedDashboard({ fileName: 'panels.json' });

    /**
     * Go to panels dashboard
     */
    await gotoDashboardPage(dashboard);

    await expect(page.getByRole('heading', { name: 'Calendar' }).first()).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Calendar' }).nth(1)).toBeVisible();

    /**
     * Go to panel Edit page
     */
    await gotoPanelEditPage({ dashboard, id: '10' });

    /**
     * Wait canvas is visible and animation is finished
     */
    await page.waitForTimeout(2000);

    /**
     * Calendar should be visible
     */
    await expect(page.getByTestId(TEST_IDS.panel.root)).toBeVisible();

    /**
     * Days of the week should be
     */
    await expect(page.getByTestId(TEST_IDS.panel.root).getByText('Sun')).toBeVisible();
    await expect(page.getByTestId(TEST_IDS.panel.root).getByText('Mon')).toBeVisible();
    await expect(page.getByTestId(TEST_IDS.panel.root).getByText('Tue')).toBeVisible();
    await expect(page.getByTestId(TEST_IDS.panel.root).getByText('Wed')).toBeVisible();
    await expect(page.getByTestId(TEST_IDS.panel.root).getByText('Thu')).toBeVisible();
    await expect(page.getByTestId(TEST_IDS.panel.root).getByText('Fri')).toBeVisible();
    await expect(page.getByTestId(TEST_IDS.panel.root).getByText('Sat')).toBeVisible();
  });

  test('Should display a time range button', async ({
    readProvisionedDashboard,
    gotoDashboardPage,
    page,
    gotoPanelEditPage,
  }) => {
    /**
     * Use panels.json dashboard
     */
    const dashboard = await readProvisionedDashboard({ fileName: 'panels.json' });

    /**
     * Go to panels dashboard
     */
    await gotoDashboardPage(dashboard);

    /**
     * Go to panel Edit page
     */
    await gotoPanelEditPage({ dashboard, id: '10' });

    /**
     * Wait canvas is visible and animation is finished
     */
    await page.waitForTimeout(2000);

    /**
     * Calendar should be visible
     */
    await expect(page.getByTestId(TEST_IDS.panel.root)).toBeVisible();

    /**
     * Click on calendar cell
     */
    await page.getByText('192 more').click();

    /**
     * Button should be
     */
    await expect(page.getByTestId(TEST_IDS.panel.buttonApplyInterval)).toBeVisible();
  });
});
