# Calendar panel for Grafana

![Calendar](https://github.com/VolkovLabs/volkovlabs-calendar-panel/raw/main/src/img/screenshot.png)

[![Grafana 9](https://img.shields.io/badge/Grafana-9.3.6-orange)](https://www.grafana.com)
![CI](https://github.com/volkovlabs/volkovlabs-calendar-panel/workflows/CI/badge.svg)
[![codecov](https://codecov.io/gh/VolkovLabs/volkovlabs-calendar-panel/branch/main/graph/badge.svg?token=0m6f0ktUar)](https://codecov.io/gh/VolkovLabs/volkovlabs-calendar-panel)
[![CodeQL](https://github.com/VolkovLabs/volkovlabs-calendar-panel/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/VolkovLabs/volkovlabs-calendar-panel/actions/workflows/codeql-analysis.yml)

## Introduction

The Calendar visualization panel is a Grafana plugin created to display calendar events from data sources.

[![Calendar plugin for Grafana tutorial | Step by step | JSON API plugin example](https://raw.githubusercontent.com/volkovlabs/volkovlabs-calendar-panel/main/img/video.png)](https://youtu.be/iPJ122x0oos)

## Requirements

- **Grafana 8.5+, Grafana 9.0+** is required.

## Getting Started

The calendar panel can be installed from the [Grafana Catalog](https://grafana.com/grafana/plugins/marcusolsson-calendar-panel/) or utilizing the Grafana command line tool.

For the latter, use the following command.

```bash
grafana-cli plugins install marcusolsson-calendar-panel
```

## Features

- Displays events in a Weekly or Daily layout depending on the selected `Time Range`.
- Allows changing `Time Range` by clicking days in the calendar.
- Query calendar events from any data source.
- Allows displaying `Annotations` across all dashboards for the selected `Time Range`.
- Supports auto-scrolling to the end of the `Time Range`.
- Allows opening data link instead of a sidebar when clicking an event.

## Events

| Option        | Description                                                         |
| ------------- | ------------------------------------------------------------------- |
| Text          | Field to use as event text. Defaults to the first text field.       |
| Description   | Field to use as event description.                                  |
| Start time    | Field to use as event start time. Defaults to the first time field. |
| End time      | Field to use as event end time.                                     |
| Labels        | Fields to use as event labels.                                      |

### Duration

- If event has only Start time configured, events are considered instantaneous.
- If event has Start and End time, events are considered to have a duration.
- Any events that are missing an End time are considered ongoing.

## Feedback

We love to hear from you. There are various ways to get in touch with us.

- Ask a question, request a new feature, and file a bug with [GitHub issues](https://github.com/volkovlabs/volkovlabs-calendar-panel/issues/new/choose).
- Sponsor our open-source plugins for Grafana with [GitHub Sponsor](https://github.com/sponsors/VolkovLabs).
- Star the repository to show your support.

## License

Apache License Version 2.0, see [LICENSE](https://github.com/volkovlabs/volkovlabs-calendar-panel/blob/main/LICENSE).
