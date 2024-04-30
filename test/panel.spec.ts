import { test, expect } from '@grafana/plugin-e2e';
import { TEST_IDS } from '../src/constants';

test.describe('Volkovlabs Calendar Panel', () => {
  test('Should display a Calendar', async ({ gotoDashboardPage, page, gotoPanelEditPage }) => {
    /**
     * Go To Panels dashboard panels.json
     * return dashboardPage
     */
    await gotoDashboardPage({ uid: 'hHK1qmpnk' });

    await expect(page.getByRole('heading', { name: 'Calendar' }).first()).toBeVisible();

    /**
     * Go to panel Edit page
     */
    await gotoPanelEditPage({ dashboard: { uid: 'hHK1qmpnk' }, id: '15' });

    /**
     * Wait canvas is visible and animation is finished
     */
    await page.waitForTimeout(3000);

    /**
     * Calendar should be visible
     */
    await expect(page.getByTestId(TEST_IDS.bigCalendar.root)).toBeVisible();

    /**
     * Days of the week should be
     */
    await expect(page.getByTestId(TEST_IDS.bigCalendar.root).getByRole('columnheader', { name: 'Sun' })).toBeVisible();
    await expect(page.getByTestId(TEST_IDS.bigCalendar.root).getByRole('columnheader', { name: 'Mon' })).toBeVisible();
    await expect(page.getByTestId(TEST_IDS.bigCalendar.root).getByRole('columnheader', { name: 'Tue' })).toBeVisible();
    await expect(page.getByTestId(TEST_IDS.bigCalendar.root).getByRole('columnheader', { name: 'Wed' })).toBeVisible();
    await expect(page.getByTestId(TEST_IDS.bigCalendar.root).getByRole('columnheader', { name: 'Thu' })).toBeVisible();
    await expect(page.getByTestId(TEST_IDS.bigCalendar.root).getByRole('columnheader', { name: 'Fri' })).toBeVisible();
    await expect(page.getByTestId(TEST_IDS.bigCalendar.root).getByRole('columnheader', { name: 'Sat' })).toBeVisible();

    /**
     * Some Controls (buttons and etc.) should be
     */
    await expect(page.getByTestId(TEST_IDS.bigCalendar.root).getByRole('button', { name: 'Today' })).toBeVisible();
    await expect(page.getByTestId(TEST_IDS.bigCalendar.root).getByRole('button', { name: 'Week' })).toBeVisible();
    await expect(page.getByTestId(TEST_IDS.bigCalendar.root).getByRole('button', { name: 'Month' })).toBeVisible();
  });
});
