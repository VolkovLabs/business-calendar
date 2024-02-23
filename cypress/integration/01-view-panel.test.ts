import { e2e } from '@grafana/e2e';
import { TestIds } from '../../src/constants';

/**
 * Dashboard
 */
const json = require('../../provisioning/dashboards/e2e.json');
const testedPanel = json.panels[0];

/**
 * Selector
 */
const getTestIdSelector = (testId: string) => `[data-testid="${testId}"]`;

/**
 * Panel
 */
describe('Viewing a panel with Calendar', () => {
  beforeEach(() => {
    e2e.flows.openDashboard({
      uid: json.uid,
    });
  });

  it('Should display a Calendar', () => {
    const currentPanel = e2e.components.Panels.Panel.title(testedPanel.title);
    currentPanel.should('be.visible');

    /**
     * Panel
     */
    const panel = currentPanel.find(getTestIdSelector(TestIds.bigCalendar.root));
    panel.should('be.visible');
  });
});
