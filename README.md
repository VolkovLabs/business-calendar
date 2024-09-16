# Business Calendar for Grafana

![Calendar](https://github.com/VolkovLabs/business-calendar/raw/main/src/img/screenshot.png)

![Grafana](https://img.shields.io/badge/Grafana-11.2-orange)
![CI](https://github.com/volkovlabs/business-calendar/workflows/CI/badge.svg)
![E2E](https://github.com/volkovlabs/business-calendar/workflows/E2E/badge.svg)
[![codecov](https://codecov.io/gh/VolkovLabs/business-calendar/branch/main/graph/badge.svg)](https://codecov.io/gh/VolkovLabs/business-calendar)
[![CodeQL](https://github.com/VolkovLabs/business-calendar/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/VolkovLabs/business-calendar/actions/workflows/codeql-analysis.yml)

## Introduction

Business Calendar panel is a Grafana plugin that displays events from various data sources.

[![Business Calendar 3.1.0 | Overview and detailed tutorial | Display dates and time in Grafana](https://raw.githubusercontent.com/volkovlabs/business-calendar/main/img/business.png)](https://youtu.be/CvLqyY2fQfo)

## Requirements

- Business Calendar panel 3.X requires **Grafana 10** or **Grafana 11**.
- Calendar panel 2.X requires **Grafana 9.2** or **Grafana 10**.
- Calendar panel 1.X requires **Grafana 8.5** or **Grafana 9**.

You can install the Business Calendar panel plugin from the [Grafana Plugins catalog](https://grafana.com/grafana/plugins/marcusolsson-calendar-panel/) or use the Grafana command line tool.

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
- Enables the display of annotations across all dashboards for the specified period.
- Supports Internationalization: Spanish, French, German, and Chinese

## Documentation

| Section                                                                   | Description                                           |
| ------------------------------------------------------------------------- | ----------------------------------------------------- |
| [Events](https://volkovlabs.io/plugins/business-calendar/events/)         | Explains how to set up a calendar to display events.  |
| [Features](https://volkovlabs.io/plugins/business-calendar/features/)     | Explains the plugin's features.                       |
| [Release Notes](https://volkovlabs.io/plugins/business-calendar/release/) | Stay up to date with the latest features and updates. |

## Business Suite for Grafana

The Business Suite is a collection of open source plugins created and actively maintained by Volkov Labs.

The collection aims to solve the most frequent business tasks by providing an intuitive interface with detailed written documentation, examples, and video tutorials.

[![Business Suite for Grafana](https://raw.githubusercontent.com/VolkovLabs/.github/main/business.png)](https://volkovlabs.io/plugins/)

## Feedback

We're looking forward to hearing from you. You can use different ways to get in touch with us.

- Ask a question, request a new feature, or report an issue at [GitHub issues](https://github.com/volkovlabs/business-calendar/issues).
- Subscribe to our [YouTube Channel](https://www.youtube.com/@volkovlabs) and leave your comments.
- Sponsor our open-source plugins for Grafana at [GitHub Sponsor](https://github.com/sponsors/VolkovLabs).
- Support our project by starring the repository.

## License

Apache License Version 2.0, see [LICENSE](https://github.com/volkovlabs/business-calendar/blob/main/LICENSE).
