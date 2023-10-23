import dayjs from 'dayjs';
import deLocale from 'dayjs/locale/de';
import enLocale from 'dayjs/locale/en';
import esLocale from 'dayjs/locale/es';
import frLocale from 'dayjs/locale/fr';
import zhLocale from 'dayjs/locale/zh';
import { useEffect, useMemo, useState } from 'react';
import { dayjsLocalizer } from 'react-big-calendar';
import { getLocaleData } from '@grafana/data';
import { LanguageMessages } from '../constants';
import { getUserLanguage } from '../utils';
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
  const language = getUserLanguage();
  const [dayjsLocale, setDayjsLocale] = useState(dayjsLocales.en);

  useEffect(() => {
    setDayjsLocale(dayjsLocales[language as keyof typeof dayjsLocales] || dayjsLocales.en);
  }, [language]);

  return useMemo(() => {
    /**
     * Update dayjs locale to support different first day of week
     * https://github.com/iamkun/dayjs/issues/215
     */
    dayjs.locale({
      ...dayjsLocale,
      weekStart: localeDate.firstDayOfWeek(),
    });

    const localizer = dayjsLocalizer(dayjs);

    /**
     * Set Year View Formats
     */
    (localizer.formats as any).yearHeaderFormat = 'YYYY';
    (localizer.formats as any).yearMonthFormat = 'MMMM';
    (localizer.formats as any).yearWeekFormat = 'dd';
    (localizer.formats as any).yearDateFormat = 'D';

    return { localizer, messages: LanguageMessages[language] };
  }, [dayjsLocale, localeDate, language]);
};
