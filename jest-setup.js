/**
 * Jest setup provided by Grafana scaffolding
 */
import './.config/jest-setup';

/**
 * Mock i18n config to prevent cycle dependencies
 */
jest.mock('./src/i18n/config');

/**
 * Setup i18next
 */
import './src/i18n';
