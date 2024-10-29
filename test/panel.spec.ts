import { test, expect } from '@grafana/plugin-e2e';
import { TEST_IDS } from '../src/constants';
import { View } from '../src/types';
import { PanelHelper, UrlHelper } from './utils';

test.describe('Volkovlabs Calendar Panel', () => {
  test('Check grafana version', async ({ grafanaVersion }) => {
    console.log('Grafana version: ', grafanaVersion);
    expect(grafanaVersion).toEqual(grafanaVersion);
  });

  test('Should display a Calendar panel', async ({ readProvisionedDashboard, gotoDashboardPage }) => {
    /**
     * Go To Panels dashboard panels.json
     * return dashboardPage
     */
    const dashboard = await readProvisionedDashboard({ fileName: 'panels.json' });
    const dashboardPage = await gotoDashboardPage({ uid: dashboard.uid });

    /**
     * Check Presence
     */
    const panel = new PanelHelper(dashboardPage, 'Calendar');
    await panel.checkIfNoErrors();
    await panel.checkPresence();

    const toolbar = panel.getToolbar();

    await toolbar.todayButtonCheckPresence();
    await toolbar.nextButtonCheckPresence();
    await toolbar.backButtonCheckPresence();
    await toolbar.viewButtonCheckPresence(View.DAY);
    await toolbar.viewButtonCheckPresence(View.AGENDA);
    await toolbar.viewButtonCheckPresence(View.MONTH);
    await toolbar.viewButtonCheckPresence(View.WEEK);
    await toolbar.viewButtonCheckPresence(View.WORK_WEEK);
    await toolbar.viewButtonCheckPresence(View.YEAR);

    await panel.checkDayHeaderPresence('Sun');
    await panel.checkDayHeaderPresence('Mon');
    await panel.checkDayHeaderPresence('Tue');
    await panel.checkDayHeaderPresence('Thu');
    await panel.checkDayHeaderPresence('Fri');
    await panel.checkDayHeaderPresence('Sat');
  });

  test('Should display a Calendar panel after refresh without errors', async ({
    readProvisionedDashboard,
    gotoDashboardPage,
  }) => {
    /**
     * Go To Panels dashboard panels.json
     * return dashboardPage
     */
    const dashboard = await readProvisionedDashboard({ fileName: 'panels.json' });
    const dashboardPage = await gotoDashboardPage({ uid: dashboard.uid });

    /**
     * Check Presence
     */
    const panel = new PanelHelper(dashboardPage, 'Calendar');
    await panel.checkIfNoErrors();
    await panel.checkPresence();

    await dashboardPage.refreshDashboard();

    await panel.checkIfNoErrors();
    await panel.checkPresence();
  });

  test('Should add empty default calendar', async ({ readProvisionedDashboard, gotoDashboardPage }) => {
    /**
     * Go To Panels dashboard weekly.json
     * return dashboardPage
     */
    const dashboard = await readProvisionedDashboard({ fileName: 'weekly.json' });
    const dashboardPage = await gotoDashboardPage({ uid: dashboard.uid });

    /**
     * Add new visualization
     */
    const editPage = await dashboardPage.addPanel();
    await editPage.setVisualization('Business Calendar');
    await editPage.setPanelTitle('Business Calendar Test');
    await editPage.backToDashboard();

    /**
     * Should add empty visualization without errors
     */
    const panel = new PanelHelper(dashboardPage, 'Business Calendar Test');
    await panel.checkIfNoErrors();
    await panel.checkPresence();

    /**
     * Should display day headers
     */
    await panel.checkDayHeaderPresence('Sun');
    await panel.checkDayHeaderPresence('Mon');
    await panel.checkDayHeaderPresence('Tue');
    await panel.checkDayHeaderPresence('Thu');
    await panel.checkDayHeaderPresence('Fri');
    await panel.checkDayHeaderPresence('Sat');
  });

  test.describe('Day view', () => {
    test('Should change view on Day', async ({ readProvisionedDashboard, gotoDashboardPage }) => {
      /**
       * Go To Panels dashboard panels.json
       * return dashboardPage
       */
      const dashboard = await readProvisionedDashboard({ fileName: 'panels.json' });
      const dashboardPage = await gotoDashboardPage({ uid: dashboard.uid });

      /**
       * Check Presence
       */
      const panel = new PanelHelper(dashboardPage, 'Calendar');
      await panel.checkIfNoErrors();
      await panel.checkPresence();

      const toolbar = panel.getToolbar();

      await toolbar.viewButtonCheckPresence(View.DAY);
      await toolbar.viewButtonCheckPresence(View.MONTH);
      await panel.checkDayHeaderPresence('Sun');
      await panel.checkDayHeaderPresence('Mon');

      /**
       * Change view
       */
      await toolbar.changeView(View.DAY);

      /**
       * Day headers should not be present on day view
       */
      await panel.checkDayHeaderNotPresence('Sun');
      await panel.checkDayHeaderNotPresence('Mon');

      await toolbar.isViewButtonDisabled(View.DAY);
      await panel.checkIfNoErrors();

      /**
       * Change view
       */
      await toolbar.changeView(View.MONTH);
    });
  });

  test.describe('Year view', () => {
    test('Should change view on year', async ({ readProvisionedDashboard, gotoDashboardPage }) => {
      /**
       * Go To Panels dashboard panels.json
       * return dashboardPage
       */
      const dashboard = await readProvisionedDashboard({ fileName: 'panels.json' });
      const dashboardPage = await gotoDashboardPage({ uid: dashboard.uid });

      /**
       * Check Presence
       */
      const panel = new PanelHelper(dashboardPage, 'Calendar');
      await panel.checkIfNoErrors();
      await panel.checkPresence();

      const toolbar = panel.getToolbar();

      await toolbar.viewButtonCheckPresence(View.YEAR);
      await toolbar.viewButtonCheckPresence(View.MONTH);
      await panel.checkDayHeaderPresence('Sun');
      await panel.checkDayHeaderPresence('Mon');

      /**
       * Change view
       */
      await toolbar.changeView(View.YEAR);

      /**
       * Day headers should not be present on day view
       */
      await panel.checkDayHeaderNotPresence('Sun');
      await panel.checkDayHeaderNotPresence('Mon');

      await toolbar.isViewButtonDisabled(View.YEAR);
      await panel.checkIfNoErrors();

      const yearView = panel.getYearView();
      await yearView.checkPresence();

      /**
       * Check first and last month
       */
      await yearView.checkMonthPresence(0);
      await yearView.checkMonthPresence(11);

      /**
       * Change view
       */
      await toolbar.changeView(View.MONTH);
    });

    test('Should navigate between years', async ({ readProvisionedDashboard, gotoDashboardPage, page }) => {
      /**
       * Go To Panels dashboard panels.json
       * return dashboardPage
       */
      const dashboard = await readProvisionedDashboard({ fileName: 'panels.json' });
      const dashboardPage = await gotoDashboardPage({ uid: dashboard.uid });

      /**
       * Check Presence
       */
      const panel = new PanelHelper(dashboardPage, 'Calendar');
      await panel.checkPresence();

      const toolbar = panel.getToolbar();

      /**
       * Change view
       */
      await toolbar.changeView(View.YEAR);
      await toolbar.isViewButtonDisabled(View.YEAR);

      const yearView = panel.getYearView();
      await yearView.checkPresence();

      const urlParams = new UrlHelper(await page.url());

      await toolbar.goBack();

      await urlParams.isParamDifferent('to', await page.url());
      /**
       * Change view
       */
      await toolbar.changeView(View.MONTH);
    });
  });

  test.describe('Languages', () => {
    test('Should display different languages for panels on dashboard', async ({
      readProvisionedDashboard,
      gotoDashboardPage,
    }) => {
      /**
       * Go To Panels dashboard different.json
       * return dashboardPage
       */
      const dashboard = await readProvisionedDashboard({ fileName: 'different.json' });
      const dashboardPage = await gotoDashboardPage({ uid: dashboard.uid });

      /**
       * Check Presence
       */
      const panelSpanish = new PanelHelper(dashboardPage, 'Spanish');
      const panelEnglish = new PanelHelper(dashboardPage, 'English');
      const panelGerman = new PanelHelper(dashboardPage, 'German');
      await panelSpanish.checkPresence();
      await panelEnglish.checkPresence();
      await panelGerman.checkPresence();

      await panelSpanish.checkDayHeaderPresence('dom.');
      await panelEnglish.checkDayHeaderPresence('Sun');
      await panelGerman.checkDayHeaderPresence('So.');

      await dashboardPage.refreshDashboard();

      /**
       * Check days after refresh
       */
      await panelSpanish.checkDayHeaderPresence('dom.');
      await panelEnglish.checkDayHeaderPresence('Sun');
      await panelGerman.checkDayHeaderPresence('So.');
    });
  });
});
