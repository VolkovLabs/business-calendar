# Changelog

## 2.0.0 (IN PROGRESS)

### Features / Enhancements

- Increase tests coverage (#105)
- Add BigCalendar component for rendering calendar (#106)
- Update ESLint configuration (#106)

## 1.4.0 (2023-06-10)

### Features / Enhancements

- Rebuild using Grafana 9.5.2 (#96, #101)
- Add Text Formatting, Mappings and Overrides (#97)
- Remove unused Standard Options (#97)
- Increase Test Coverage and update testing library (#100, #103)
- Migrate to Plugin Tools 1.5.2 (#101)
- Update to Node 18 (#101)
- Add E2E Cypress testing (#102)

### Bug fixes

- Increase event spacing to prevent overflow (#96)

## 1.3.0 (2023-03-08)

### Features / Enhancements

- Rebuild using Grafana 9.4.3 (#87)
- Add labels split to display in the drawer (#88)
- Add annotation tags as labels (#88)
- Refactor multi-day interval (#89)
- Add display colors based on Event or Frame id if the Color field is not specified (#90)
- Add support for Color schemes (#91)
- Add video configuration tutorial (#92)

### Bug fixes

- Fix scrollable content in the Day drawer (#93)

## 1.2.0 (2023-02-23)

### Breaking changes

Refactoring and Styles migration may introduce breaking changes. Please test before upgrading in Production.

### Features / Enhancements

- Select color for calender entry queries (#67)
- Filtering out undefined events (#69)
- Update CI and Release Workflows (#72)
- Rebuild using Grafana 9.3.6 (#73)
- Refactor Options Editors to use Field pickers (#74)
- Refactor Day and Events Drawer (#75)
- Set No Padding for the Panel (#75)
- Refactor Day and update Styles (#76)
- Migrate Styles to v2 (#79)
- Match Grafana settings for Week Start (#80)
- Skip undefined events in Drawer (#81)
- Add Display Time (#82)
- Update Styles and Screenshot (#83)

## 1.1.0 (2022-12-12)

### Breaking changes

Refactoring may introduce breaking changes. Please test before upgrading in Production.

### Features / Enhancements

- Update Panel options in README (#53)
- Add Youtube tutorial for Calendar with JSON API data source (#54)
- Update CI to Node 16 and Synchronize with Release workflow (#56)
- Update to Grafana 9.2.2 (#57)
- Code Refactoring (#58)
- Update to Grafana 9.3.1 (#59)
- Update CI to upload signed artifacts (#60)
- Refactor panel options and increase test coverage (#61)
- Add annotation support (#8)
- Refactoring and Removing legacy code (#62)
- Refactor Panel Options and add Annotations options (#63)

## 1.0.0 (2022-10-02)

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
