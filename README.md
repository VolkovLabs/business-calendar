# Calendar panel plugin for Grafana

![Calendar](https://github.com/VolkovLabs/volkovlabs-calendar-panel/raw/main/src/img/screenshot.png)

[![Grafana 9](https://img.shields.io/badge/Grafana-9.2.2-orange)](https://www.grafana.com)
![CI](https://github.com/volkovlabs/volkovlabs-calendar-panel/workflows/CI/badge.svg)
[![codecov](https://codecov.io/gh/VolkovLabs/volkovlabs-calendar-panel/branch/main/graph/badge.svg?token=0m6f0ktUar)](https://codecov.io/gh/VolkovLabs/volkovlabs-calendar-panel)

## Introduction

The Calendar panel plugin for Grafana to display calendar events from data sources.

[![Calendar plugin for Grafana tutorial | Step by step | JSON API plugin example](https://raw.githubusercontent.com/volkovlabs/volkovlabs-calendar-panel/main/img/video.png)](https://youtu.be/iPJ122x0oos)

### Requirements

- **Grafana 8.5+, Grafana 9.0+** is required.

## Getting Started

Calendar panel can be installed from the [Grafana Catalog](https://grafana.com/grafana/plugins/marcusolsson-calendar-panel/) or use the `grafana-cli` tool to install from the command line:

```bash
grafana-cli plugins install marcusolsson-calendar-panel
```

## Features

- Allows to change time range by selecting the days in the calendar.
- Query calendar events from any data source.

## Panel options

| Option             | Description                                               |
| ------------------ | --------------------------------------------------------- |
| _Scroll to bottom_ | Automatically scroll to the end of the time range.        |
| _Quick links_      | Open data link instead of sidebar when clicking an event. |

### Dimensions

| Option        | Description                                                         |
| ------------- | ------------------------------------------------------------------- |
| _Text_        | Field to use as event text. Defaults to the first text field.       |
| _Description_ | Field to use as event description.                                  |
| _Start time_  | Field to use as event start time. Defaults to the first time field. |
| _End time_    | Field to use as event end time.                                     |
| _Labels_      | Fields to use as event labels.                                      |

If only **Start** is configured, events are considered instantaneous.

If **End** are configured, events are considered to have a duration. Any events that are missing an end time are considered ongoing.

## Feedback

We love to hear from users, developers, and the whole community interested in this plugin. These are various ways to get in touch with us:

- Ask a question, request a new feature, and file a bug with [GitHub issues](https://github.com/volkovlabs/volkovlabs-calendar-panel/issues/new/choose).
- Sponsor our open-source plugins for Grafana with [GitHub Sponsor](https://github.com/sponsors/VolkovLabs).
- Star the repository to show your support.

## License

- Apache License Version 2.0, see [LICENSE](https://github.com/volkovlabs/volkovlabs-calendar-panel/blob/main/LICENSE).
