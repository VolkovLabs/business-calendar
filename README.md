# Business Calendar for Grafana

![Calendar](https://github.com/VolkovLabs/business-calendar/raw/main/src/img/screenshot.png)

![Grafana](https://img.shields.io/badge/Grafana-11.3-orange)
![CI](https://github.com/volkovlabs/business-calendar/workflows/CI/badge.svg)
![E2E](https://github.com/volkovlabs/business-calendar/workflows/E2E/badge.svg)
[![codecov](https://codecov.io/gh/VolkovLabs/business-calendar/branch/main/graph/badge.svg)](https://codecov.io/gh/VolkovLabs/business-calendar)
[![CodeQL](https://github.com/VolkovLabs/business-calendar/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/VolkovLabs/business-calendar/actions/workflows/codeql-analysis.yml)

## Introduction

The Business Calendar panel is a Grafana plugin that displays events in a stylish calendar format. The data can come from various data sources.

[![Business Calendar 3.1.0 | Overview and detailed tutorial | Display dates and time in Grafana](https://raw.githubusercontent.com/volkovlabs/business-calendar/main/img/business.png)](https://youtu.be/CvLqyY2fQfo)

## Requirements

- The Business Calendar panel 3.X requires **Grafana 10** or **Grafana 11**.
- Calendar panel 2.X requires **Grafana 9.2** or **Grafana 10**.
- Calendar panel 1.X requires **Grafana 8.5** or **Grafana 9**.

## Getting Started

You can install the Business Calendar panel plugin from the [Grafana Plugins catalog](https://grafana.com/grafana/plugins/marcusolsson-calendar-panel/) or use the Grafana command line tool.

For the latter, please use the following command:

```bash
grafana-cli plugins install marcusolsson-calendar-panel
```

## Highlights

- Intuitive multi-language toolbar that allows you to:
  - Switch between the **Day**, **Week**, **Month**, **Work Week**, **Year**, and **Agenda** views.
  - Switch back to today's events.
  - Display events from the previous and subsequent time ranges.
- Fetch and combine event data from any data sources.
- Event filter by a time range.
- Event coloring based on the Grafana Thresholds.
- Enables the opening of a data link instead of a sidebar when clicking on an event.
- Enables the display of annotations across all dashboards for the specified period.
- Supports Internationalization: Spanish, French, German, Portuguese, and Chinese.

## Documentation

| Section                                                                              | Description                                                    |
| ------------------------------------------------------------------------------------ | -------------------------------------------------------------- |
| [Basic configuration](https://volkovlabs.io/plugins/business-calendar/basic-config/) | Explains plugin basics                                         |
| [Configuration](https://volkovlabs.io/plugins/business-calendar/sections/)           | Describes configuration options                                |
| [Features](https://volkovlabs.io/plugins/business-calendar/features/)                | Describes plugin's features                                    |
| [Tutorials](https://volkovlabs.io/plugins/business-calendar/tutorials/)              | Easy to follow tutorials                                       |
| [Release Notes](https://volkovlabs.io/plugins/business-calendar/release/)            | Allows to stay up to date with the latest features and updates |

## Business Suite for Grafana

The Business Suite is a collection of open source plugins created and actively maintained by Volkov Labs.

The collection aims to solve the most frequent business tasks by providing an intuitive interface with detailed written documentation, examples, and video tutorials.

[![Business Suite for Grafana](https://raw.githubusercontent.com/VolkovLabs/.github/main/business.png)](https://volkovlabs.io/plugins/)

### Enterprise Support

With the [Business Suite Enterprise](https://volkovlabs.io/pricing/), you're not just getting a product, you're getting a complete support system. You'll have a designated support team ready to tackle any issues.

You can contact us via Zendesk, receive priority in feature requests and bug fixes, meet with us for in-person consultation, and get access to the Business Intelligence. It's a package that's designed to make your life easier.

## Always happy to hear from you

- Ask a question, request a new feature, or report an issue at [GitHub issues](https://github.com/volkovlabs/business-calendar/issues).
- Subscribe to our [YouTube Channel](https://youtube.com/@volkovlabs) and leave your comments.
- Become a [Business Suite sponsor](https://github.com/sponsors/VolkovLabs).

## License

Apache License Version 2.0, see [LICENSE](https://github.com/volkovlabs/business-calendar/blob/main/LICENSE).
