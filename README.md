# Calendar panel for Grafana

![Calendar](https://github.com/VolkovLabs/volkovlabs-calendar-panel/raw/main/src/img/screenshot.png)

![Grafana 9](https://img.shields.io/badge/Grafana-9.5.2-orange)
![CI](https://github.com/volkovlabs/volkovlabs-calendar-panel/workflows/CI/badge.svg)
![E2E](https://github.com/volkovlabs/volkovlabs-calendar-panel/workflows/E2E/badge.svg)
[![codecov](https://codecov.io/gh/VolkovLabs/volkovlabs-calendar-panel/branch/main/graph/badge.svg?token=0m6f0ktUar)](https://codecov.io/gh/VolkovLabs/volkovlabs-calendar-panel)
[![CodeQL](https://github.com/VolkovLabs/volkovlabs-calendar-panel/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/VolkovLabs/volkovlabs-calendar-panel/actions/workflows/codeql-analysis.yml)

## Introduction

The Calendar visualization panel is a Grafana plugin created to display calendar events from data sources.

[![Calendar plugin for Grafana tutorial | Step by step | JSON API plugin example](https://raw.githubusercontent.com/volkovlabs/volkovlabs-calendar-panel/main/img/video.png)](https://youtu.be/iPJ122x0oos)

## Requirements

- **Grafana 8.5** and **Grafana 9** are required for major version 1.

## Getting Started

The calendar panel can be installed from the [Grafana Catalog](https://grafana.com/grafana/plugins/marcusolsson-calendar-panel/) or utilizing the Grafana command line tool.

For the latter, use the following command.

```bash
grafana-cli plugins install marcusolsson-calendar-panel
```

## Highlights

- Displays events in a Weekly or Monthly layout depending on the selected Time Range.
- Query calendar events from any data source.
- Allows changing Time Range by clicking on days in the calendar.
- Supports auto-scrolling to the end of the Time Range.
- Supports event colors based on Thresholds.
- Allows opening data link instead of a sidebar when clicking an event.
- Allows displaying Annotations across all dashboards for the selected Time Range.

## Documentation

| Section                  | Description                                             |
| ------------------------ | ------------------------------------------------------- |
| [Events](https://volkovlabs.io/plugins/volkovlabs-calendar-panel/events/)         | Explains how to set up a calendar to display your data. |
| [Release Notes](https://volkovlabs.io/plugins/volkovlabs-calendar-panel/release/) | Stay up to date with the latest features and updates.   |

## Tutorial

This video outlines all the new features we implemented and explains how to configure events.

[![How to display events from PostgreSQL | Calendar plugin for Grafana | February 2023 Release](https://raw.githubusercontent.com/volkovlabs/volkovlabs-calendar-panel/main/img/release.png)](https://youtu.be/6WGmm5y4fs4)

## Feedback

We love to hear from you. There are various ways to get in touch with us.

- Ask a question, request a new feature, and file a bug with [GitHub issues](https://github.com/volkovlabs/volkovlabs-calendar-panel/issues/new/choose).
- Subscribe to our [YouTube Channel](https://www.youtube.com/@volkovlabs) and add a comment.
- Sponsor our open-source plugins for Grafana with [GitHub Sponsor](https://github.com/sponsors/VolkovLabs).
- Star the repository to show your support.

## License

Apache License Version 2.0, see [LICENSE](https://github.com/volkovlabs/volkovlabs-calendar-panel/blob/main/LICENSE).
