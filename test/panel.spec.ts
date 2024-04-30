import { test, expect } from '@grafana/plugin-e2e';
import { TEST_IDS } from '../src/constants';
import { View } from '../src/types';

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
    await gotoPanelEditPage({ dashboard: { uid: 'hHK1qmpnk' }, id: '16' });

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
     * Check calendar navigation controls
     */
    await expect(page.getByTestId(TEST_IDS.bigCalendar.root).getByRole('button', { name: 'Today' })).toBeVisible();

    /**
     * Check if calendar supports all views
     */
    await expect(
      page.getByTestId(TEST_IDS.bigCalendar.root).getByTestId(TEST_IDS.bigCalendarToolbar.buttonView(View.DAY))
    ).toBeVisible();
    await expect(
      page.getByTestId(TEST_IDS.bigCalendar.root).getByTestId(TEST_IDS.bigCalendarToolbar.buttonView(View.WEEK))
    ).toBeVisible();
    await expect(
      page.getByTestId(TEST_IDS.bigCalendar.root).getByTestId(TEST_IDS.bigCalendarToolbar.buttonView(View.WORK_WEEK))
    ).toBeVisible();
    await expect(
      page.getByTestId(TEST_IDS.bigCalendar.root).getByTestId(TEST_IDS.bigCalendarToolbar.buttonView(View.MONTH))
    ).toBeVisible();
    await expect(
      page.getByTestId(TEST_IDS.bigCalendar.root).getByTestId(TEST_IDS.bigCalendarToolbar.buttonView(View.YEAR))
    ).toBeVisible();
  });
});
