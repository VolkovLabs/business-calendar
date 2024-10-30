import { Locator } from '@playwright/test';
import { DashboardPage, expect, Panel } from '@grafana/plugin-e2e';
import { TEST_IDS } from '../../src/constants';
import { getLocatorSelectors, LocatorSelectors } from './selectors';

const getToolbarSelectors = getLocatorSelectors(TEST_IDS.bigCalendarToolbar);
const getYearViewSelectors = getLocatorSelectors(TEST_IDS.yearView);

/**
 * Year View Helper
 */
class YearViewHelper {
  public selectors: LocatorSelectors<typeof TEST_IDS.yearView>;

  constructor(public readonly locator: Locator) {
    this.selectors = this.getSelectors(locator);
  }

  private getMsg(msg: string): string {
    return `YearView: ${msg}`;
  }

  private getSelectors(locator: Locator) {
    return getYearViewSelectors(locator);
  }

  public async checkPresence() {
    return expect(this.selectors.root(), this.getMsg('Year view Presence')).toBeVisible();
  }

  public async checkMonthPresence(month: number) {
    return expect(this.selectors.month(month), this.getMsg(`Month - ${month} Presence`)).toBeVisible();
  }
}

/**
 * Toolbar Helper
 */
class ToolbarHelper {
  public selectors: LocatorSelectors<typeof TEST_IDS.bigCalendarToolbar>;

  constructor(public readonly locator: Locator) {
    this.selectors = this.getSelectors(locator);
  }

  private getMsg(msg: string): string {
    return `Toolbar: ${msg}`;
  }

  private getSelectors(locator: Locator) {
    return getToolbarSelectors(locator);
  }

  public async todayButtonCheckPresence() {
    return expect(this.selectors.buttonToday(), this.getMsg('Button "Today" Presence')).toBeVisible();
  }

  public async nextButtonCheckPresence() {
    return expect(this.selectors.buttonNext(), this.getMsg('Button "Next" Presence')).toBeVisible();
  }

  public async backButtonCheckPresence() {
    return expect(this.selectors.buttonBack(), this.getMsg('Button "Back" Presence')).toBeVisible();
  }

  public async viewButtonCheckPresence(view: string) {
    return expect(this.selectors.buttonView(view), this.getMsg(`Button ${view} Presence`)).toBeVisible();
  }

  public async changeView(view: string) {
    return this.selectors.buttonView(view).click();
  }

  public async isViewButtonDisabled(view: string) {
    return expect(this.selectors.buttonView(view), this.getMsg(`Button ${view} Disabled`)).toBeDisabled();
  }

  public async goBack() {
    return this.selectors.buttonBack().click();
  }
}

/**
 * Panel Helper
 */
export class PanelHelper {
  private readonly locator: Locator;
  private readonly panel: Panel;
  private readonly title: string;
  private readonly selectors: LocatorSelectors<typeof TEST_IDS.bigCalendar>;

  constructor(dashboardPage: DashboardPage, panelTitle: string) {
    this.panel = dashboardPage.getPanelByTitle(panelTitle);
    this.title = panelTitle;
    this.locator = this.panel.locator;
    this.selectors = getLocatorSelectors(TEST_IDS.bigCalendar)(this.locator);
  }

  private getMsg(msg: string): string {
    return `Panel: ${msg}`;
  }

  public getToolbar() {
    return new ToolbarHelper(this.locator);
  }

  public getYearView() {
    return new YearViewHelper(this.locator);
  }

  public async checkIfNoErrors() {
    return expect(this.panel.getErrorIcon(), this.getMsg('Check If No Errors')).not.toBeVisible();
  }

  public async checkPresence() {
    return expect(this.selectors.root(), this.getMsg(`Check ${this.title} Presence`)).toBeVisible();
  }

  public async checkDayHeaderPresence(dayName: string) {
    return expect(
      this.selectors.root().getByRole('columnheader', { name: dayName }),
      this.getMsg(`Check ${dayName} Presence`)
    ).toBeVisible();
  }

  public async checkDayHeaderNotPresence(dayName: string) {
    return expect(
      this.selectors.root().getByRole('columnheader', { name: dayName }),
      this.getMsg(`Check ${dayName} Not Presence`)
    ).not.toBeVisible();
  }
}
