import { expect, test } from 'vitest';
import { Appointment } from './appointment';
import { getFutureDate } from '../tests/utils/get-future-date';

test('create an appointment', () => {
  const startsAt = getFutureDate('2022-01-01');
  const endsAt = getFutureDate('2022-01-02');

  endsAt.setDate(endsAt.getDate() + 1);

  const appointment = new Appointment({
    customer: 'John Doe',
    startsAt,
    endsAt
  })

  expect(appointment).toBeInstanceOf(Appointment);
  expect(appointment.customer).toBe('John Doe');
})

test('cannot create an appointment with end date before start date', () => {
  const startsAt = getFutureDate('2022-01-02');
  const endsAt = getFutureDate('2022-01-01');

  endsAt.setDate(endsAt.getDate() - 1);

  expect(() => {
    return new Appointment({
      customer: 'John Doe',
      startsAt,
      endsAt
    })
  }).toThrow();
})


test('cannot create an appointment with start date before now', () => {
  const startsAt = new Date();
  const endsAt = new Date();

  startsAt.setDate(startsAt.getDate() - 1);
  endsAt.setDate(endsAt.getDate() + 2);

  expect(() => {
    return new Appointment({
      customer: 'John Doe',
      startsAt,
      endsAt
    })
  }).toThrow();
})