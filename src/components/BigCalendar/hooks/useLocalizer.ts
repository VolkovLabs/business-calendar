import { getLocaleData } from '@grafana/data';
import { useEffect, useState, useMemo } from 'react';
import dayjs from 'dayjs';
import enLocale from 'dayjs/locale/en';
import esLocale from 'dayjs/locale/es';
import frLocale from 'dayjs/locale/fr';
import deLocale from 'dayjs/locale/de';
import zhLocale from 'dayjs/locale/zh';
import { config } from '@grafana/runtime';
import { dayjsLocalizer } from 'react-big-calendar';

/**
 * Dayjs locales per each grafana language
 * Dynamic import is not needed until there is too many locales
 * Each locale is about 1kb
 */
const dayjsLocales = {
  en: enLocale,
  es: esLocale,
  fr: frLocale,
  de: deLocale,
  zh: zhLocale,
};

/**
 * Get Localizer
 */
export const useLocalizer = () => {
  const localeDate = getLocaleData();
  const { language } = config.bootData.user;
  const localeName = language.split('-')[0];
  const [dayjsLocale, setDayjsLocale] = useState(dayjsLocales.en);

  useEffect(() => {
    setDayjsLocale(dayjsLocales[localeName as keyof typeof dayjsLocales] || dayjsLocales.en);
  }, [localeName]);

  return useMemo(() => {
    /**
     * Update dayjs locale to support different first day of week
     * https://github.com/iamkun/dayjs/issues/215
     */
    dayjs.locale({
      ...dayjsLocale,
      weekStart: localeDate.firstDayOfWeek(),
    });
    return dayjsLocalizer(dayjs);
  }, [dayjsLocale, localeDate]);
};
