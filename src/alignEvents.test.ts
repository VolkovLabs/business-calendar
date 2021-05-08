import dayjs from 'dayjs';

import { alignEvents } from 'alignEvents';

describe('alignEvents', () => {
  it('missing end time', () => {
    const events = [
      {
        label: 'Deployed to test',
        start: dayjs('2020-01-01T15:06:02Z'),
        open: false,
      },
    ];

    const aligned = alignEvents(events);

    expect(Object.keys(aligned)).toEqual(['2020-01-01']);
    expect(aligned['2020-01-01']).toEqual(events);
  });

  it('two-day event', () => {
    const events = [
      {
        label: 'Deployed to test for two days',
        start: dayjs('2020-01-01T15:06:02Z'),
        end: dayjs('2020-01-02T15:06:02Z'),
        open: false,
      },
    ];

    const aligned = alignEvents(events);

    expect(Object.keys(aligned)).toEqual(['2020-01-01', '2020-01-02']);
    expect(aligned['2020-01-01']).toEqual(events);
    expect(aligned['2020-01-02']).toEqual(events);
  });

  // TODO: This currently fails as the event gets deduplicated.
  it('parallel two-day events', () => {
    const events = [
      {
        label: 'Deployed to test for two days',
        start: dayjs('2020-01-01T15:06:02Z'),
        end: dayjs('2020-01-02T15:06:02Z'),
        open: false,
      },
      {
        label: 'Tested for two days',
        start: dayjs('2020-01-01T15:06:02Z'),
        end: dayjs('2020-01-02T15:06:02Z'),
        open: false,
      },
    ];

    const aligned = alignEvents(events);

    expect(Object.keys(aligned)).toEqual(['2020-01-01', '2020-01-02']);
    expect(aligned['2020-01-01']).toEqual(events);
    expect(aligned['2020-01-02']).toEqual(events);
  });

  it('overlapping two-day events', () => {
    const events = [
      {
        label: 'Deployed to test for two days',
        start: dayjs('2020-01-01T15:02:02Z'),
        end: dayjs('2020-01-02T15:06:02Z'),
        open: false,
      },
      {
        label: 'Tested for two days',
        start: dayjs('2020-01-02T15:06:02Z'),
        end: dayjs('2020-01-03T15:06:02Z'),
        open: false,
      },
    ];

    const aligned = alignEvents(events);

    expect(Object.keys(aligned)).toEqual(['2020-01-01', '2020-01-02', '2020-01-03']);
    expect(aligned['2020-01-01']).toEqual([events[0]]);
    expect(aligned['2020-01-02']).toEqual([events[0], events[1]]);
    expect(aligned['2020-01-03']).toEqual([undefined, events[1]]);
  });

  it('staggered two-day events', () => {
    const events = [
      {
        label: 'Deployed to test for two days',
        start: dayjs('2020-01-01T15:06:02Z'),
        end: dayjs('2020-01-02T15:06:02Z'),
        open: false,
      },
      {
        label: 'Tested for two days',
        start: dayjs('2020-01-02T15:06:02Z'),
        end: dayjs('2020-01-03T15:06:02Z'),
        open: false,
      },
      {
        label: 'QA for two days',
        start: dayjs('2020-01-03T15:06:02Z'),
        end: dayjs('2020-01-04T15:06:02Z'),
        open: false,
      },
    ];

    const aligned = alignEvents(events);

    expect(Object.keys(aligned)).toStrictEqual(['2020-01-01', '2020-01-02', '2020-01-03', '2020-01-04']);
    expect(aligned['2020-01-01']).toEqual([events[0]]);
    expect(aligned['2020-01-02']).toEqual([events[0], events[1]]);
    expect(aligned['2020-01-03']).toEqual([events[2], events[1]]);
    expect(aligned['2020-01-04']).toEqual([events[2]]);
  });

  it('multi-staggered two-day events', () => {
    const numEvents = 100;
    const eventDuration = 2;
    const start = dayjs('2020-01-01T15:06:02Z');

    const events = Array.from({ length: numEvents }).map((_, i) => {
      return {
        label: `Event ${i}`,
        start: start.add(i, 'day'),
        end: start.add(eventDuration - 1, 'day').add(i, 'day'),
        open: false,
      };
    });

    const aligned = alignEvents(events);

    const lastDay = aligned[start.add(numEvents, 'days').format('YYYY-MM-DD')];
    const lastEvent = lastDay[lastDay.length - 1];

    expect(Object.keys(aligned).length).toEqual(numEvents + 1);
    expect(lastDay.length).toEqual(eventDuration);
    expect(lastEvent?.label).toEqual(`Event ${numEvents - 1}`);
  });
});
