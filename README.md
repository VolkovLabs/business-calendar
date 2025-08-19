# Business Calendar for Grafana

![Business Calendar Screenshot](https://github.com/VolkovLabs/business-calendar/raw/main/src/img/screenshot.png)

[![Grafana](https://img.shields.io/badge/Grafana-12.1-orange)](https://grafana.com)
[![CI](https://github.com/volkovlabs/business-calendar/workflows/CI/badge.svg)](https://github.com/volkovlabs/business-calendar/actions/workflows/ci.yml)
[![E2E](https://github.com/volkovlabs/business-calendar/workflows/E2E/badge.svg)](https://github.com/volkovlabs/business-calendar/actions/workflows/e2e.yml)
[![Codecov](https://codecov.io/gh/VolkovLabs/business-calendar/branch/main/graph/badge.svg)](https://codecov.io/gh/VolkovLabs/business-calendar)
[![CodeQL](https://github.com/VolkovLabs/business-calendar/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/VolkovLabs/business-calendar/actions/workflows/codeql-analysis.yml)

**Business Calendar** is a powerful Grafana plugin that transforms your data into an intuitive calendar view. Seamlessly visualize schedules, deadlines, and time-based metrics from any Grafana-supported data source.

## 📺 Watch Overview and Tutorial Video

[![Business Calendar 3.1.0 | Overview and Detailed Tutorial](https://raw.githubusercontent.com/volkovlabs/business-calendar/main/img/business.png)](https://youtu.be/CvLqyY2fQfo)

## 🚀 Features

- **Multi-Language Toolbar**: Switch between Day, Week, Month, Work Week, Year, and Agenda views with ease. Navigate to today’s events or browse time ranges.
- **Data Flexibility**: Integrate and display events from any Grafana data source.
- **Time Range Filtering**: Zoom in on specific periods for focused analysis.
- **Threshold Coloring**: Highlight events with customizable colors using Grafana thresholds.
- **Quick Links**: Click events to access data links directly (bypassing sidebars).
- **Annotations**: Display dashboard annotations for selected time ranges.
- **Localization**: Available in Spanish, French, German, Portuguese, and Chinese.

## 📋 Requirements

- **Version 4.x**: Grafana 11 or Grafana 12.
- **Version 3.x**: Grafana 10 or Grafana 11.
- **Version 2.x**: Grafana 9.2 or Grafana 10.
- **Version 1.x**: Grafana 8.5 or Grafana 9.

## 🛠️ Installation

Get started with Business Calendar in just a few steps:

1. Install the plugin via the [Grafana Plugins Catalog](https://grafana.com/grafana/plugins/marcusolsson-calendar-panel/) or using the Grafana CLI:
   ```bash
   grafana-cli plugins install marcusolsson-calendar-panel
   ```
2. Restart Grafana to load the plugin.
3. Add the **Business Calendar** panel to your dashboard and configure your data source.

### 📺 **Need help with installation?**

[![Install Business Suite Plugins in Cloud, OSS, Enterprise](https://raw.githubusercontent.com/volkovlabs/.github/main/started.png)](https://youtu.be/1qYzHfPXJF8)

## 📚 Documentation

Explore comprehensive guides and resources to master the plugin:

| Section                                                                              | Description                                      |
| ------------------------------------------------------------------------------------ | ------------------------------------------------ |
| [Basic Configuration](https://volkovlabs.io/plugins/business-calendar/basic-config/) | Learn the essentials to get started.             |
| [Configuration Options](https://volkovlabs.io/plugins/business-calendar/sections/)   | Dive into all customization settings.            |
| [Features](https://volkovlabs.io/plugins/business-calendar/features/)                | Discover key capabilities and use cases.         |
| [Tutorials](https://volkovlabs.io/plugins/business-calendar/tutorials/)              | Follow step-by-step guides for practical setups. |
| [Release Notes](https://volkovlabs.io/plugins/business-calendar/release/)            | Stay updated on new features and fixes.          |

## 🌟 Business Suite for Grafana

Business Calendar is part of the **Business Suite**, a collection of open-source Grafana plugins by [Volkov Labs](https://volkovlabs.io/). These plugins are crafted to address common business challenges with user-friendly interfaces, detailed documentation, and supporting video tutorials.

[![Business Suite for Grafana](https://raw.githubusercontent.com/VolkovLabs/.github/main/business.png)](https://volkovlabs.io/plugins/)

## 📜 License

This project is licensed under the [Apache License 2.0](https://github.com/volkovlabs/business-calendar/blob/main/LICENSE).
