import { getLocaleData } from '@grafana/data';
import dayjs from 'dayjs';
import deLocale from 'dayjs/locale/de';
import enLocale from 'dayjs/locale/en';
import esLocale from 'dayjs/locale/es';
import frLocale from 'dayjs/locale/fr';
import ptLocale from 'dayjs/locale/pt';
import zhLocale from 'dayjs/locale/zh';
import { useEffect, useMemo, useState } from 'react';
import { dayjsLocalizer } from 'react-big-calendar';
import { useTranslation } from 'react-i18next';

import { BigMessages, CalendarOptions, DateFormat, DateLocalizer } from '../types';
import { getUserLanguage } from '../utils';

/**
 * Due to dayjs types inconsistency we have to disable this rule
 */
/* eslint-disable @typescript-eslint/naming-convention */

/**
 * ISO 8601 format
 * 2019-01-25T00:00:00-02:00Z
 */
const isoFormat = 'YYYY-MM-DDTHH:mm:ssZ[Z]';

/**
 * Dayjs locales per each grafana language
 * Dynamic import is not needed until there is too many locales
 * Each locale is about 1kb
 */
const dayjsLocales: Record<Exclude<DateFormat, 'inherit'>, ILocale> = {
  en: enLocale,
  en24: {
    ...enLocale,
    formats: {
      ...enLocale.formats,
      LT: 'HH:mm',
      LTS: 'HH:mm:ss',
      LLL: 'MMMM D, YYYY HH:mm',
      LLLL: 'dddd, MMMM D, YYYY HH:mm',
      lll: 'MMM D, YYYY HH:mm',
      llll: 'ddd, MMM D, YYYY HH:mm',
    } as never,
  },
  es: esLocale,
  fr: frLocale,
  de: deLocale,
  zh: zhLocale,
  pt: ptLocale,
  iso: {
    ...enLocale,
    formats: {
      LT: isoFormat,
      LTS: isoFormat,
      L: isoFormat,
      LL: isoFormat,
      LLL: isoFormat,
      LLLL: isoFormat,
      l: isoFormat,
      ll: isoFormat,
      lll: isoFormat,
      llll: isoFormat,
    } as never,
  },
};

/**
 * Get Localizer
 */
export const useLocalizer = (options: CalendarOptions) => {
  /**
   * Translation
   */
  const { t } = useTranslation();

  const localeDate = getLocaleData();
  const language = getUserLanguage();
  /**
   * Is used for days of the week and month names
   */
  const [dayjsLocale, setDayjsLocale] = useState(dayjsLocales.en);

  /**
   * Update Dayjs locale on language change
   */
  useEffect(() => {
    let locale = dayjsLocales[language as keyof typeof dayjsLocales];

    if (options.dateFormat !== DateFormat.INHERIT) {
      locale = dayjsLocales[options.dateFormat];
    }

    setDayjsLocale(locale || dayjsLocales.en);
  }, [language, options.dateFormat]);

  /**
   * Localizer Messages
   */
  const messages: BigMessages = useMemo(
    () => ({
      date: t('localizerMessages.date'),
      time: t('localizerMessages.time'),
      event: t('localizerMessages.event'),
      allDay: t('localizerMessages.allDay'),
      week: t('localizerMessages.week'),
      work_week: t('localizerMessages.workWeek'),
      day: t('localizerMessages.day'),
      month: t('localizerMessages.month'),
      previous: t('localizerMessages.previous'),
      next: t('localizerMessages.next'),
      yesterday: t('localizerMessages.yesterday'),
      tomorrow: t('localizerMessages.tomorrow'),
      today: t('localizerMessages.today'),
      agenda: t('localizerMessages.agenda'),
      noEventsInRange: t('localizerMessages.noEventsInRange'),
      showMore: (total) => t('localizerMessages.showMore', { total }),
      year: t('localizerMessages.year'),
    }),
    [t]
  );

  return useMemo(() => {
    /**
     * Update dayjs locale to support different first day of week
     * https://github.com/iamkun/dayjs/issues/215
     */
    dayjs.locale({
      ...dayjsLocale,
      weekStart: localeDate.firstDayOfWeek(),
    });

    /**
     * Localizer
     */
    const localizer = dayjsLocalizer(dayjs) as DateLocalizer;

    /**
     * Set Year View Formats
     */
    localizer.formats.yearHeaderFormat = 'YYYY';
    localizer.formats.yearMonthFormat = 'MMMM';
    localizer.formats.yearWeekFormat = 'dd';
    localizer.formats.yearDateFormat = 'D';

    return { localizer, messages: messages };
  }, [dayjsLocale, localeDate, messages]);
};
