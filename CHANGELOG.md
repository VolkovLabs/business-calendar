# Changelog

## 1.0.0 (IN PROGRESS)

### Features / Enhancements

- Maintained by Volkov Labs (#51)
- Updated based on Volkov Labs Panel Template (#51)
- Update to Grafana 9.1.6 (#52)

## 0.7.1 (2022-08-28)

### Features / Enhancements

- Update to Grafana 9

## 0.7.0 (2022-03-09)

### Features / Enhancements

- Quick links: Enable quick links to follow the data link when you click the event rather than opening a modal.
- Update to Grafana 8.4.3

## 0.6.0 (2022-01-28)

### Breaking changes

This release bumps the minimum required Grafana to >=8.0. Grafana 8 introduces a new theming engine for panel plugins.

- If you're running a Grafana version before 8.0, you should stay with v0.5.0.
- If you're running Grafana 8.0 or above, you should update to v0.6.0.

## 0.5.0 (2021-09-06)

### Features / Enhancements

- Data links support (#25)
- **New details view:** Instead of relying on tooltips, this version uses an inline drawer to display additional details. I like this better, but the built-in drawer component has some limitations. I'm not sure I like that it's a modal for example. I might end up creating a custom sidebar component. Let me know what you think about the new design!

## 0.4.3 (2021-06-12)

### Features / Enhancements

- Change "Apply time interval" to "Apply time range" to match Grafana
- Increase contrast for single-day events

## 0.4.2 (2021-05-22)

### Bug fixes

- classicColors is (still) undefined (#16)

## 0.4.1 (2021-05-21)

### Bug fixes

- classicColors is undefined (#16)
- Improve legibility of event text (#15)

## 0.4.0 (2021-05-20)

### Features / Enhancements

- Show event name if event starts in day out of filter (#13)
- More calendars and colors (#14)
- Line breaks in event description (#11)

## 0.3.0 (2021-05-18)

### Features / Enhancements

- Show more details for individual events (#10)

## 0.2.0 (2021-05-09)

### Features / Enhancements

- Multi-day events (#1)
- Display truncated events (#6)
- Allow string and number fields for time dimensions

## 0.1.1 (2021-02-10)

No changes.

## 0.1.0 (2021-02-10)

Initial release. Not fit for production.
