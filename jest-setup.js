/**
 * Jest setup provided by Grafana scaffolding
 */
import './.config/jest-setup';

import { TextDecoder, TextEncoder } from 'util';

/**
 * Mock i18n config to prevent cycle dependencies
 */
jest.mock('./src/i18n/config');

/**
 * Setup i18next
 */
import './src/i18n';

/**
 * Assign Text Decoder and Encoder which are required in @grafana/ui
 */
Object.assign(global, { TextDecoder, TextEncoder });
