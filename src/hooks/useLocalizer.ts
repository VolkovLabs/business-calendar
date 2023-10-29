import dayjs from 'dayjs';
import deLocale from 'dayjs/locale/de';
import enLocale from 'dayjs/locale/en';
import esLocale from 'dayjs/locale/es';
import frLocale from 'dayjs/locale/fr';
import zhLocale from 'dayjs/locale/zh';
import { useEffect, useMemo, useState } from 'react';
import { dayjsLocalizer } from 'react-big-calendar';
import { useTranslation } from 'react-i18next';
import { getLocaleData } from '@grafana/data';
import { BigMessages } from '../types';
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
  /**
   * Translation
   */
  const { t } = useTranslation();

  const localeDate = getLocaleData();
  const language = getUserLanguage();
  const [dayjsLocale, setDayjsLocale] = useState(dayjsLocales.en);

  /**
   * Update Dayjs locale on language change
   */
  useEffect(() => {
    setDayjsLocale(dayjsLocales[language as keyof typeof dayjsLocales] || dayjsLocales.en);
  }, [language]);

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
    const localizer = dayjsLocalizer(dayjs);

    /**
     * Set Year View Formats
     */
    (localizer.formats as any).yearHeaderFormat = 'YYYY';
    (localizer.formats as any).yearMonthFormat = 'MMMM';
    (localizer.formats as any).yearWeekFormat = 'dd';
    (localizer.formats as any).yearDateFormat = 'D';

    return { localizer, messages: messages };
  }, [dayjsLocale, localeDate, messages]);
};
