# Calendar for Grafana

[![Build](https://github.com/marcusolsson/grafana-calendar-panel/workflows/CI/badge.svg)](https://github.com/marcusolsson/grafana-calendar-panel/actions?query=workflow%3A%22CI%22)
[![Release](https://github.com/marcusolsson/grafana-calendar-panel/workflows/Release/badge.svg)](https://github.com/marcusolsson/grafana-calendar-panel/actions?query=workflow%3ARelease)
[![License](https://img.shields.io/github/license/marcusolsson/grafana-calendar-panel)](LICENSE)
[![Twitter](https://img.shields.io/twitter/follow/marcusolsson?color=%231DA1F2&label=twitter&style=plastic)](https://twitter.com/marcusolsson)

A panel plugin for [Grafana](https://grafana.com) to display calendar events from data sources.

**Important:** This plugin is still under development and is **not fit for production use**. Please use it and [submit issues](https://github.com/marcusolsson/grafana-calendar-panel/issues/new) to improve it.

## Configuration

This section lists the available configuration options.

### Panel options

#### Dimensions

| Option | Description |
|--------|-------------|
| _Text_ | Name of the field to use for the event name. Defaults to the first string field. |
| _Time_ | Name of the field to use for the event time. Defaults to the first time field. |
