# Changelog

## 3.9.1 (2025-03-18)

### Enhancements

- Updated "There are no events in this range" message in the alert info component (#258)
- Adjusted Yearly view layout to prevent shifting with smaller panel sizes (#257)
- Enabled Yearly view to display events from previous years (#260)

## 3.9.0 (2025-02-20)

### Enhancements

- Updated end-to-end (e2e) tests (#250)
- Upgraded to Grafana 11.5 and updated dependencies (#252)
- Enhanced release workflow to include attestation (#252)

## 3.8.0 (2024-10-25)

### Enhancements

- Added multi-day event support in Yearly view (#243)
- Updated migration process for threshold color filters (#248)
- Improved `useRuntimeVariables` hook for Scenes dashboards (#247)
- Upgraded to Grafana 11.3 and updated dependencies (#248)

## 3.7.0 (2024-09-15)

### Enhancements

- Enhanced Yearly view to display events (#240)
- Upgraded to Grafana 11.2 and updated dependencies (#241)

## 3.6.0 (2024-08-19)

### Enhancements

- Modified tooltip to prevent drawer opening when selecting text (#235)
- Updated date-time format to support multiple languages (#236)
- Hid event detail actions when no actions are available (#238)

## 3.5.0 (2024-07-25)

### Enhancements

- Added event details in tooltip on hover (#217, #221)
- Introduced option to disable event time display (#223)
- Updated daily calendar view to reflect time range changes (#229)
- Reordered description fields for consistency (#230)
- Adjusted date handling to use time zone option (#227)

## 3.4.0 (2024-07-16)

### Enhancements

- Improved E2E workflow using Docker (#211)
- Added font size configuration option (#213)
- Upgraded to Grafana 11.1 and updated dependencies (#214)

## 3.3.0 (2024-06-19)

### Enhancements

- Enhanced variables with static datasource for time range in source dashboard (#205)
- Added support for multiple description fields (#206)
- Introduced threshold-based color options (#208)
- Added Portuguese language support in Grafana 11 (#209)

## 3.2.0 (2024-06-11)

### Enhancements

- Updated tutorial video (#190)
- Added formatting options for event descriptions (#182)
- Improved details drawer layout (#192)
- Added support for additional time range sources (#179)
- Enhanced event format (#188)
- Updated time range in Agenda view (#196)
- Improved mouse cursor behavior in Agenda view (#200)
- Updated dependencies (#200)
- Added display of dashboard annotations (#194)
- Introduced Portuguese language support (#201)
- Localized toolbar and messages to the selected language (#203)

## 3.1.0 (2024-05-19)

### Enhancements

- Added Agenda (List) view (#177)
- Enhanced customization for event bubbles (#178)
- Improved multi-day window handling (#183)
- Upgraded to Grafana 11 (#184)

## 3.0.0 (2024-05-02)

### Breaking Changes

- Renamed plugin to "Business Calendar Panel"
- Replaced Legacy Calendar with Big Calendar
- Now requires Grafana 10 or 11

### Enhancements

- Preserved dashboard refresh on time range changes (#167)
- Added plugin e2e tests and removed Cypress (#168, #170)
- Replaced Legacy Calendar with Big Calendar (#172)
- Prepared compatibility for Grafana 11 (#175, #176)

## 2.5.0 (2024-03-20)

### Enhancements

- Updated styling for event detail tags (#161)
- Upgraded dependencies to Grafana 10.4 (#154)

### Bug Fixes

- Fixed display of location in Month and Work Week views (#160)

## 2.4.0 (2024-03-07)

### Enhancements

- Upgraded Big Calendar to version 1.10.3 (#150)
- Added option to select date format (#151)
- Updated ESLint configuration and refactored code (#152)
- Updated dependencies and GitHub Actions (#154)
- Added option to hide end time (#155)

### Bug Fixes

- Fixed retention of calendar dates when time range is unchanged (#156)

## 2.3.1 (2023-11-06)

### Bug Fixes

- Corrected import order for default Big Calendar styles and overrides (#143)

## 2.3.0 (2023-11-01)

### Enhancements

- Added Yearly view (#134)
- Introduced internationalization (Spanish, French, German, Chinese) (#135, #138)
- Added default view selection option (#137)
- Enabled "scroll to time" feature in Big Calendar (#140, #141)

## 2.2.0 (2023-10-06)

### Enhancements

- Added event location support in Big Calendar (#127)
- Improved contrast for event text colors (#129)
- Upgraded to Grafana 10.1.4 and Plugin Tools 2.0.2 (#132)
- Updated Grafana Access Policy for plugin signing (#132)
- Added dashboard timezone support for start and end times (#128)
- Added view selection options: Day, Week, Work Week, and Month (#133)

## 2.1.0 (2023-08-14)

### Enhancements

- Added annotation type and limit options (#121)
- Upgraded to Grafana 10.0.3 (#122)
- Added language messages for Big Calendar (#123)

## 2.0.1 (2023-08-03)

### Bug Fixes

- Fixed display of annotation options (#119)

## 2.0.0 (2023-07-28)

### Breaking Changes

- Now requires Grafana 9.2 or 10

### Enhancements

- Increased test coverage (#105)
- Introduced Big Calendar component for rendering (#106)
- Updated ESLint configuration (#106)
- Removed support for Grafana 8.5 (#110)
- Upgraded to Grafana 10.0 (#110)
- Improved event overlap handling when start and end dates are equal in Big Calendar (#112)
- Added quick links in Big Calendar (#113)
- Updated back/next buttons for Weekly and Daily views in Big Calendar (#114)
- Enhanced button styles in Big Calendar (#115)
- Improved calendar resizing in Big Calendar (#116)

## 1.4.0 (2023-06-10)

### Enhancements

- Upgraded to Grafana 9.5.2 (#96, #101)
- Added text formatting, mappings, and overrides (#97)
- Removed unused standard options (#97)
- Increased test coverage and updated testing library (#100, #103)
- Migrated to Plugin Tools 1.5.2 (#101)
- Upgraded to Node 18 (#101)
- Added E2E Cypress testing (#102)

### Bug Fixes

- Increased event spacing to prevent overflow (#96)

## 1.3.0 (2023-03-08)

### Enhancements

- Upgraded to Grafana 9.4.3 (#87)
- Added label splitting for display in drawer (#88)
- Added annotation tags as labels (#88)
- Improved multi-day interval handling (#89)
- Enabled color display based on event or frame ID if color field is unspecified (#90)
- Added support for color schemes (#91)
- Added video configuration tutorial (#92)

### Bug Fixes

- Fixed scrollable content in Day drawer (#93)

## 1.2.0 (2023-02-23)

### Breaking Changes

- Refactoring and styles migration may introduce breaking changes. Test before upgrading in production.

### Enhancements

- Added color selection for calendar entry queries (#67)
- Filtered out undefined events (#69)
- Updated CI and release workflows (#72)
- Rebuilt using Grafana 9.3.6 (#73)
- Refactored options editors to use field pickers (#74)
- Refactored Day and Events drawer (#75)
- Removed panel padding (#75)
- Updated Day view and styles (#76)
- Migrated to Styles v2 (#79)
- Aligned week start with Grafana settings (#80)
- Skipped undefined events in drawer (#81)
- Added display time option (#82)
- Updated styles and screenshot (#83)

## 1.1.0 (2022-12-12)

### Breaking Changes

- Refactoring may introduce breaking changes. Test before upgrading in production.

### Enhancements

- Updated panel options in README (#53)
- Added YouTube tutorial for Calendar with JSON API datasource (#54)
- Updated CI to Node 16 and synced with release workflow (#56)
- Upgraded to Grafana 9.2.2 (#57)
- Refactored code (#58)
- Upgraded to Grafana 9.3.1 (#59)
- Updated CI to upload signed artifacts (#60)
- Refactored panel options and increased test coverage (#61)
- Added annotation support (#8)
- Removed legacy code (#62)
- Enhanced panel options with annotations (#63)

## 1.0.0 (2022-10-02)

### Enhancements

- Transferred maintenance to Volkov Labs (#51)
- Updated based on Volkov Labs Panel Template (#51)
- Upgraded to Grafana 9.1.6 (#52)

## 0.7.1 (2022-08-28)

### Enhancements

- Upgraded to Grafana 9

## 0.7.0 (2022-03-09)

### Enhancements

- Added quick links to follow data links on event click instead of opening a modal
- Upgraded to Grafana 8.4.3

## 0.6.0 (2022-01-28)

### Breaking Changes

- Increased minimum Grafana requirement to 8.0 due to new theming engine
  - Use v0.5.0 for Grafana versions below 8.0
  - Upgrade to v0.6.0 for Grafana 8.0 or higher

## 0.5.0 (2021-09-06)

### Enhancements

- Added data links support (#25)
- Introduced inline drawer for event details, replacing tooltips (#25)
  - Note: Feedback welcome on the new design; considering a custom sidebar alternative

## 0.4.3 (2021-06-12)

### Enhancements

- Renamed "Apply time interval" to "Apply time range" to align with Grafana
- Increased contrast for single-day events

## 0.4.2 (2021-05-22)

### Bug Fixes

- Fixed issue where `classicColors` was still undefined (#16)

## 0.4.1 (2021-05-21)

### Bug Fixes

- Fixed `classicColors` undefined error (#16)
- Improved legibility of event text (#15)

## 0.4.0 (2021-05-20)

### Enhancements

- Displayed event names for events starting outside the filtered day (#13)
- Added support for more calendars and colors (#14)
- Enabled line breaks in event descriptions (#11)

## 0.3.0 (2021-05-18)

### Enhancements

- Added detailed view for individual events (#10)

## 0.2.0 (2021-05-09)

### Enhancements

- Added multi-day event support (#1)
- Enabled display of truncated events (#6)
- Supported string and number fields for time dimensions

## 0.1.1 (2021-02-10)

- No changes

## 0.1.0 (2021-02-10)

- Initial release (not production-ready)
