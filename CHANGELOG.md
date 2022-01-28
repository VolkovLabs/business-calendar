# Changelog

## 0.6.0 (2022-01-28)

[Full changelog](https://github.com/marcusolsson/grafana-calendar-panel/compare/v0.5.0...v0.6.0)

This release bumps the minimum required Grafana to >=8.0. Grafana 8 introduces a new theming engine for panel plugins.

- If you're running a Grafana version before 8.0, you should stay with v0.5.0.
- If you're running Grafana 8.0 or above, you should update to v0.6.0.

## 0.5.0 (2021-09-06)

[Full changelog](https://github.com/marcusolsson/grafana-calendar-panel/compare/v0.4.3...v0.5.0)

### Enhancements

- Data links support ([#25](https://github.com/marcusolsson/grafana-calendar-panel/issues/25))
- **New details view:** Instead of relying on tooltips, this version uses an inline drawer to display additional details. I like this better, but the built-in drawer component has some limitations. I'm not sure I like that it's a modal for example. I might end up creating a custom sidebar component. Let me know what you think about the new design!

## 0.4.3 (2021-06-12)

[Full changelog](https://github.com/marcusolsson/grafana-calendar-panel/compare/v0.4.2...v0.4.3)

### Enhancements

- Change "Apply time interval" to "Apply time range" to match Grafana
- Increase contrast for single-day events

## 0.4.2 (2021-05-22)

[Full changelog](https://github.com/marcusolsson/grafana-calendar-panel/compare/v0.4.1...v0.4.2)

### Bug fixes

- classicColors is (still) undefined ([#16](https://github.com/marcusolsson/grafana-calendar-panel/issues/16))

## 0.4.1 (2021-05-21)

[Full changelog](https://github.com/marcusolsson/grafana-calendar-panel/compare/v0.4.0...v0.4.1)

### Bug fixes

- classicColors is undefined ([#16](https://github.com/marcusolsson/grafana-calendar-panel/issues/16))
- Improve legibility of event text ([#15](https://github.com/marcusolsson/grafana-calendar-panel/issues/15))

## 0.4.0 (2021-05-20)

[Full changelog](https://github.com/marcusolsson/grafana-calendar-panel/compare/v0.3.0...v0.4.0)

### Enhancements

- Show event name if event starts in day out of filter ([#13](https://github.com/marcusolsson/grafana-calendar-panel/issues/13))
- More calendars and colors ([#14](https://github.com/marcusolsson/grafana-calendar-panel/issues/14))
- Line breaks in event description ([#11](https://github.com/marcusolsson/grafana-calendar-panel/issues/11))

## 0.3.0 (2021-05-18)

[Full changelog](https://github.com/marcusolsson/grafana-calendar-panel/compare/v0.2.0...v0.3.0)

### Enhancements

- Show more details for individual events ([#10](https://github.com/marcusolsson/grafana-calendar-panel/issues/10))

## 0.2.0 (2021-05-09)

[Full changelog](https://github.com/marcusolsson/grafana-calendar-panel/compare/v0.1.1...v0.2.0)

### Enhancements

- Multi-day events ([#1](https://github.com/marcusolsson/grafana-calendar-panel/issues/1))
- Display truncated events ([#6](https://github.com/marcusolsson/grafana-calendar-panel/issues/6))
- Allow string and number fields for time dimensions

## 0.1.1 (2021-02-10)

[Full changelog](https://github.com/marcusolsson/grafana-calendar-panel/compare/v0.1.0...v0.1.1)

No changes.

## 0.1.0 (2021-02-10)

Initial release. Not fit for production.
