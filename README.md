# Calendar for Grafana

[![Build](https://github.com/marcusolsson/grafana-calendar-panel/workflows/CI/badge.svg)](https://github.com/marcusolsson/grafana-calendar-panel/actions?query=workflow%3A%22CI%22)
[![Release](https://github.com/marcusolsson/grafana-calendar-panel/workflows/Release/badge.svg)](https://github.com/marcusolsson/grafana-calendar-panel/actions?query=workflow%3ARelease)
[![License](https://img.shields.io/github/license/marcusolsson/grafana-calendar-panel)](LICENSE)
[![Twitter](https://img.shields.io/twitter/follow/marcusolsson?color=%231DA1F2&label=twitter&style=plastic)](https://twitter.com/marcusolsson)
![Maintenance](https://img.shields.io/maintenance/no/2022?style=plastic)

> **Important:** As of July 2022, I'm no longer actively maintaining this plugin. At the time of writing, I'm not aware of any replacement panel.

A panel plugin for [Grafana](https://grafana.com) to display calendar events from data sources.

- **Change time range** by selecting the days in the calendar
- **Query calendar events** from any data source

![Screenshot](https://github.com/marcusolsson/grafana-calendar-panel/raw/main/src/img/screenshot.png)

## Configuration

This section lists the available configuration options.

### Panel options

#### Display

| Option             | Description                                        |
|--------------------|----------------------------------------------------|
| _Scroll to bottom_ | Automatically scroll to the end of the time range. |

#### Dimensions

| Option        | Description                                                         |
|---------------|---------------------------------------------------------------------|
| _Text_        | Field to use as event text. Defaults to the first text field.       |
| _Description_ | Field to use as event description.                                  |
| _Start time_  | Field to use as event start time. Defaults to the first time field. |
| _End time_    | Field to use as event end time.                                     |
| _Labels_      | Fields to use as event labels.                                      |

If only **Start** is configured, events are considered instantaneous.

If **End** are configured, events are considered to have a duration. Any events that are missing an end time are considered ongoing.
