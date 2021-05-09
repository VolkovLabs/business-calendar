# Calendar for Grafana

[![Build](https://github.com/marcusolsson/grafana-calendar-panel/workflows/CI/badge.svg)](https://github.com/marcusolsson/grafana-calendar-panel/actions?query=workflow%3A%22CI%22)
[![Release](https://github.com/marcusolsson/grafana-calendar-panel/workflows/Release/badge.svg)](https://github.com/marcusolsson/grafana-calendar-panel/actions?query=workflow%3ARelease)
[![License](https://img.shields.io/github/license/marcusolsson/grafana-calendar-panel)](LICENSE)
[![Twitter](https://img.shields.io/twitter/follow/marcusolsson?color=%231DA1F2&label=twitter&style=plastic)](https://twitter.com/marcusolsson)

A panel plugin for [Grafana](https://grafana.com) to display calendar events from data sources.

- **Change time interval** by selecting the days in the calendar
- **Query calendar events** from any data source

![Screenshot](https://github.com/marcusolsson/grafana-calendar-panel/raw/main/src/img/screenshot.png)

## Configuration

This section lists the available configuration options.

### Panel options

#### Dimensions

| Option       | Description                                                                          |
|--------------|--------------------------------------------------------------------------------------|
| _Text_       | Name of the field to use for the event text. Defaults to the first string field.     |
| _Start time_ | Name of the field to use for the event start time. Defaults to the first time field. |
| _End time_   | Name of the field to use for the event end time.                                     |

If only **Start** is configured, events are considered instantaneous.

If **End** are configured, events are considered to have a duration. Any events that are missing an end time are considered ongoing.
