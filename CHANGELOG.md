# Changelog

## 3.2.0 (IN PROGRESS)

### Features / Enhancements

- Updated tutorial video (#190)
- Added Formatting for event description (#182)
- Updated Details drawer layout (#192)
- Added support for additional Time Range sources (#179)
- Updated Time Range in Agenda view (#196)
- Updated mouse cursor for Agenda view (#200)
- Updated dependencies (#200)

## 3.1.0 (2024-05-19)

### Features / Enhancements

- Added Agenda (List) View (#177)
- Updated customization for Event Bubble (#178)
- Updated multi-day window (#183)
- Updated to Grafana 11 (#184)

## 3.0.0 (2024-05-02)

### Breaking changes

- Plugin rebranding, the new name is the Business Calendar Panel.
- Legacy Calendar was replaced by Big Calendar.
- Requires Grafana 10 and Grafana 11.

### Features / Enhancements

- Added keeping refresh dashboard on time range change (#167)
- Added plugin e2e tests and remove cypress (#168, #170)
- Removed Legacy calendar replaced by Big Calendar (#172)
- Prepared for Grafana 11 (#175, #176)

## 2.5.0 (2024-03-20)

### Features / Enhancements

- Updated style for event details tags (#161)
- Updated dependencies to Grafana 10.4 (#154)

### Bugfixes

- Fixed showing location on month and work week views (#160)

## 2.4.0 (2024-03-07)

### Features / Enhancements

- Updated Big Calendar to 1.10.3 (#150)
- Added ability to select date format (#151)
- Updated ESLint configuration and refactoring (#152)
- Updated dependencies and Actions (#154)
- Added hiding end time (#155)

### Bugfixes

- Fixed keeping calendar dates if no time range change (#156)

## 2.3.1 (2023-11-06)

### Bugfixes

- Fixed import order for default big-calendar styles and their overrides (#143)

## 2.3.0 (2023-11-01)

### Features / Enhancements

- Added yearly view (#134)
- Added internationalization(Spanish, French, German, and Chinese) i18n (#135, #138)
- Added default view option (#137)
- Added scroll to Time option for BigCalendar (#140, #141)

## 2.2.0 (2023-10-06)

### Features / Enhancements

- Added Event Location for Big Calendar (#127)
- Added contrast text color for events (#129)
- Updated to Grafana 10.1.4 (#132)
- Updated to Plugin Tools 2.0.2 (#132)
- Updated Grafana Access Policy to sign plugin (#132)
- Added support of dashboard timezone in Start and End time (#128)
- Added ability to select views: day, week, work week and month (#133)

## 2.1.0 (2023-08-14)

### Features / Enhancements

- Added Annotations type and limit (#121)
- Updated to Grafana 10.0.3 (#122)
- Added Big Calendar Language Messages (#123)

## 2.0.1 (2023-08-03)

### Bugfixes

- Fixed display annotations options (#119)

## 2.0.0 (2023-07-28)

### Breaking changes

- Requires Grafana 9.2 and Grafana 10

### Features / Enhancements

- Increased tests coverage (#105)
- Added Big Calendar component for rendering calendar (#106)
- Updated ESLint configuration (#106)
- Removed Grafana 8.5 support (#110)
- Updated to Grafana 10.0 (#110)
- Updated events overlap when the start date equals the end date in Big Calendar (#112)
- Added quick links for Big Calendar (#113)
- Updated back/next button for weekly and daily views in Big Calendar (#114)
- Updated button styles for Big Calendar (#115)
- Updated calendar resizing for Big Calendar (#116)

## 1.4.0 (2023-06-10)

### Features / Enhancements

- Updated using Grafana 9.5.2 (#96, #101)
- Added Text Formatting, Mappings and Overrides (#97)
- Removed unused Standard Options (#97)
- Increased Test Coverage and update testing library (#100, #103)
- Migrated to Plugin Tools 1.5.2 (#101)
- Updated to Node 18 (#101)
- Added E2E Cypress testing (#102)

### Bug fixes

- Increased event spacing to prevent overflow (#96)

## 1.3.0 (2023-03-08)

### Features / Enhancements

- Updated using Grafana 9.4.3 (#87)
- Added labels split to display in the drawer (#88)
- Added annotation tags as labels (#88)
- Updated multi-day interval (#89)
- Added display colors based on Event or Frame id if the Color field is not specified (#90)
- Added support for Color schemes (#91)
- Added video configuration tutorial (#92)

### Bug fixes

- Fixed scrollable content in the Day drawer (#93)

## 1.2.0 (2023-02-23)

### Breaking changes

Refactoring and Styles migration may introduce breaking changes. Please test before upgrading in Production.

### Features / Enhancements

- Select color for calender entry queries (#67)
- Filtering out undefined events (#69)
- Updated CI and Release Workflows (#72)
- Rebuild using Grafana 9.3.6 (#73)
- Refactor Options Editors to use Field pickers (#74)
- Refactor Day and Events Drawer (#75)
- Set No Padding for the Panel (#75)
- Refactor Day and update Styles (#76)
- Migrated Styles to v2 (#79)
- Match Grafana settings for Week Start (#80)
- Skip undefined events in Drawer (#81)
- Added Display Time (#82)
- Updated Styles and Screenshot (#83)

## 1.1.0 (2022-12-12)

### Breaking changes

Refactoring may introduce breaking changes. Please test before upgrading in Production.

### Features / Enhancements

- Updated Panel options in README (#53)
- Added Youtube tutorial for Calendar with JSON API data source (#54)
- Updated CI to Node 16 and Synchronize with Release workflow (#56)
- Updated to Grafana 9.2.2 (#57)
- Code Refactoring (#58)
- Updated to Grafana 9.3.1 (#59)
- Updated CI to upload signed artifacts (#60)
- Refactor panel options and increase test coverage (#61)
- Added annotation support (#8)
- Refactoring and Removing legacy code (#62)
- Refactor Panel Options and add Annotations options (#63)

## 1.0.0 (2022-10-02)

### Features / Enhancements

- Maintained by Volkov Labs (#51)
- Updated based on Volkov Labs Panel Template (#51)
- Updated to Grafana 9.1.6 (#52)

## 0.7.1 (2022-08-28)

### Features / Enhancements

- Updated to Grafana 9

## 0.7.0 (2022-03-09)

### Features / Enhancements

- Quick links: Enable quick links to follow the data link when you click the event rather than opening a modal.
- Updated to Grafana 8.4.3

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
