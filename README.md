# Business Calendar for Grafana

![Business Calendar Screenshot](https://github.com/VolkovLabs/business-calendar/raw/main/src/img/screenshot.png)

![Grafana 11.5](https://img.shields.io/badge/Grafana-11.5-orange)
![CI](https://github.com/volkovlabs/business-calendar/workflows/CI/badge.svg)
![E2E](https://github.com/volkovlabs/business-calendar/workflows/E2E/badge.svg)
[![Codecov](https://codecov.io/gh/VolkovLabs/business-calendar/branch/main/graph/badge.svg)](https://codecov.io/gh/VolkovLabs/business-calendar)
[![CodeQL](https://github.com/VolkovLabs/business-calendar/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/VolkovLabs/business-calendar/actions/workflows/codeql-analysis.yml)

## Introduction

The **Business Calendar** is a Grafana plugin that elegantly displays events in a calendar format, pulling data from any Grafana-supported data source. It’s perfect for visualizing schedules, deadlines, or time-based metrics in a user-friendly way.

Check out our overview and tutorial video:

[![Business Calendar 3.1.0 | Overview and Detailed Tutorial](https://raw.githubusercontent.com/volkovlabs/business-calendar/main/img/business.png)](https://youtu.be/CvLqyY2fQfo)

## Requirements

- **Version 3.x**: Requires Grafana 10 or Grafana 11.
- **Version 2.x**: Compatible with Grafana 9.2 or Grafana 10.
- **Version 1.x**: Works with Grafana 8.5 or Grafana 9.

## Getting Started

Install the Business Calendar plugin via the [Grafana Plugins Catalog](https://grafana.com/grafana/plugins/marcusolsson-calendar-panel/) or using the Grafana CLI:

```bash
grafana-cli plugins install marcusolsson-calendar-panel
```

After installation, restart Grafana, then add the Business Calendar panel to your dashboard.

## Features

- **Multi-Language Toolbar**:
  - Switch between Day, Week, Month, Work Week, Year, and Agenda views.
  - Jump to today’s events or navigate previous/next time ranges.
- **Data Flexibility**: Fetch and combine events from any data source.
- **Time Range Filtering**: Focus on specific periods.
- **Threshold Coloring**: Customize event colors with Grafana thresholds.
- **Quick Links**: Click events to open data links instead of a sidebar.
- **Annotations**: Show dashboard annotations for a selected time range.
- **Localization**: Supports Spanish, French, German, Portuguese, and Chinese.

## Documentation

Find everything you need to master the plugin:

| Section                                                                              | Description                             |
| ------------------------------------------------------------------------------------ | --------------------------------------- |
| [Basic Configuration](https://volkovlabs.io/plugins/business-calendar/basic-config/) | Get started with the essentials.        |
| [Configuration Options](https://volkovlabs.io/plugins/business-calendar/sections/)   | Explore all customization settings.     |
| [Features](https://volkovlabs.io/plugins/business-calendar/features/)                | Learn about key capabilities.           |
| [Tutorials](https://volkovlabs.io/plugins/business-calendar/tutorials/)              | Follow step-by-step guides.             |
| [Release Notes](https://volkovlabs.io/plugins/business-calendar/release/)            | Stay updated on new features and fixes. |

## Business Suite for Grafana

The Business Calendar is part of the **Business Suite**, a set of open-source Grafana plugins by [Volkov Labs](https://volkovlabs.io/). Designed to tackle common business needs, these plugins offer intuitive interfaces, detailed docs, and video tutorials.

[![Business Suite for Grafana](https://raw.githubusercontent.com/VolkovLabs/.github/main/business.png)](https://volkovlabs.io/plugins/)

### Enterprise Support

Opt for [Business Suite Enterprise](https://volkovlabs.io/pricing/) to unlock premium support:

- Dedicated Zendesk support team.
- Priority feature requests and bug fixes.
- In-person consultations.
- Access to Business Intelligence platform.

## Feedback & Contributions

We’d love to hear from you! Get involved:

- **Issues**: Report bugs or suggest features on [GitHub Issues](https://github.com/volkovlabs/business-calendar/issues).
- **YouTube**: Subscribe to [Volkov Labs](https://youtube.com/@volkovlabs) and comment on our videos.

## License

Licensed under the [Apache License 2.0](https://github.com/volkovlabs/business-calendar/blob/main/LICENSE).
