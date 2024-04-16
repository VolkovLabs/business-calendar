import { test, expect } from '@grafana/plugin-e2e';
import { TestIds } from '../src/constants';

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

    await expect(page.getByRole('heading', { name: 'Calendar' })).toBeVisible();

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
    await expect(page.getByTestId(TestIds.panel.root)).toBeVisible();

    /**
     * Days of the week should be
     */
    await expect(page.getByTestId(TestIds.panel.root).getByText('Sun')).toBeVisible();
    await expect(page.getByTestId(TestIds.panel.root).getByText('Mon')).toBeVisible();
    await expect(page.getByTestId(TestIds.panel.root).getByText('Tue')).toBeVisible();
    await expect(page.getByTestId(TestIds.panel.root).getByText('Wed')).toBeVisible();
    await expect(page.getByTestId(TestIds.panel.root).getByText('Thu')).toBeVisible();
    await expect(page.getByTestId(TestIds.panel.root).getByText('Fri')).toBeVisible();
    await expect(page.getByTestId(TestIds.panel.root).getByText('Sat')).toBeVisible();
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
    await expect(page.getByTestId(TestIds.panel.root)).toBeVisible();

    /**
     * Click on calendar cell
     */
    await page.getByText('192 more').click();

    /**
     * Button should be
     */
    await expect(page.getByTestId(TestIds.panel.buttonApplyInterval)).toBeVisible();
  });
});
