# Calendar panel for Grafana

![Calendar](https://github.com/VolkovLabs/volkovlabs-calendar-panel/raw/main/src/img/screenshot.png)

![Grafana](https://img.shields.io/badge/Grafana-10.4-orange)
![CI](https://github.com/volkovlabs/volkovlabs-calendar-panel/workflows/CI/badge.svg)
![E2E](https://github.com/volkovlabs/volkovlabs-calendar-panel/workflows/E2E/badge.svg)
[![codecov](https://codecov.io/gh/VolkovLabs/volkovlabs-calendar-panel/branch/main/graph/badge.svg?token=0m6f0ktUar)](https://codecov.io/gh/VolkovLabs/volkovlabs-calendar-panel)
[![CodeQL](https://github.com/VolkovLabs/volkovlabs-calendar-panel/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/VolkovLabs/volkovlabs-calendar-panel/actions/workflows/codeql-analysis.yml)

## Introduction

Calendar Panel is a Grafana plugin that displays events from various data sources.

[![Calendar plugin for Grafana tutorial | Step by step | JSON API plugin example](https://raw.githubusercontent.com/volkovlabs/volkovlabs-calendar-panel/main/img/video.png)](https://youtu.be/iPJ122x0oos)

## Requirements

- Calendar Panel 2.X requires **Grafana 9.2** or **Grafana 10**.
- Calendar Panel 1.X requires **Grafana 8.5** or **Grafana 9**.

You can install the Calendar Panel plugin from the [Grafana Plugins catalog](https://grafana.com/grafana/plugins/marcusolsson-calendar-panel/) or using the Grafana command line tool.

For the latter, please use the following command:

```bash
grafana-cli plugins install marcusolsson-calendar-panel
```

## Highlights

- Displays events in a monthly, weekly, or daily view.
- Query calendar events from any data source.
- Supports the filtration of events by a time range.
- Supports the event coloring based on thresholds.
- Enables the opening of a data link instead of a sidebar when clicking an event.
- Enables the display of annotations across all dashboards for the specified time period.
- Supports Internationalization: Spanish, French, German, and Chinese

## Documentation

| Section                                                                           | Description                                           |
| --------------------------------------------------------------------------------- | ----------------------------------------------------- |
| [Events](https://volkovlabs.io/plugins/volkovlabs-calendar-panel/events/)         | Explains how to set up a calendar to display events.  |
| [Features](https://volkovlabs.io/plugins/volkovlabs-calendar-panel/features/)     | Explains the plugin's features.                       |
| [Release Notes](https://volkovlabs.io/plugins/volkovlabs-calendar-panel/release/) | Stay up to date with the latest features and updates. |

## Tutorial

This video outlines all the new features we implemented and explains how to configure events.

[![How to display events from PostgreSQL | Calendar plugin for Grafana | February 2023 Release](https://raw.githubusercontent.com/volkovlabs/volkovlabs-calendar-panel/main/img/release.png)](https://youtu.be/6WGmm5y4fs4)

## Feedback

We're looking forward to hearing from you. You can use different ways to get in touch with us.

- Ask a question, request a new feature, or report an issue at [GitHub issues](https://github.com/volkovlabs/volkovlabs-calendar-panel/issues/new/choose).
- Subscribe to our [YouTube Channel](https://www.youtube.com/@volkovlabs) and leave your comments.
- Sponsor our open-source plugins for Grafana at [GitHub Sponsor](https://github.com/sponsors/VolkovLabs).
- Support our project by starring the repository.

## License

Apache License Version 2.0, see [LICENSE](https://github.com/volkovlabs/volkovlabs-calendar-panel/blob/main/LICENSE).
