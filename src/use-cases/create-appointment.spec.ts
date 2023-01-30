import { describe, expect, it } from "vitest";
import { Appointment } from "../entities/appointment";
import { InMemoryAppointsmentsRepository } from "../repositories/in-memory/in-memory-appointments-repository";
import { getFutureDate } from "../tests/utils/get-future-date";
import { CreateAppointment } from "./create-appointment";

describe('Create Appointment', () => {
  it('should be able to create an appointment', () => {
    const startsAt = getFutureDate('2022-01-02');
    const endsAt = getFutureDate('2022-01-03');

    const appointmentRepository = new InMemoryAppointsmentsRepository();
    const createAppointment = new CreateAppointment(appointmentRepository);

    expect(createAppointment.execute({
      customer: 'John Doe',
      startsAt,
      endsAt
    })).resolves.toBeInstanceOf(Appointment);
  })

  it('should not be able to create an appointment with overlapping dates', async () => {
    const startsAt = getFutureDate('2022-01-02');
    const endsAt = getFutureDate('2022-01-07');

    const appointmentRepository = new InMemoryAppointsmentsRepository();
    const createAppointment = new CreateAppointment(appointmentRepository);

    await createAppointment.execute({
      customer: 'John Doe',
      startsAt,
      endsAt
    });

    expect(createAppointment.execute({
      customer: 'John Doe',
      startsAt: getFutureDate('2022-01-05'),
      endsAt: getFutureDate('2022-02-10'),
    })).rejects.toBeInstanceOf(Error);

    expect(createAppointment.execute({
      customer: 'John Doe',
      startsAt: getFutureDate('2022-01-01'),
      endsAt: getFutureDate('2022-02-05'),
    })).rejects.toBeInstanceOf(Error);

    expect(createAppointment.execute({
      customer: 'John Doe',
      startsAt: getFutureDate('2022-01-01'),
      endsAt: getFutureDate('2022-02-08'),
    })).rejects.toBeInstanceOf(Error);

    expect(createAppointment.execute({
      customer: 'John Doe',
      startsAt: getFutureDate('2022-01-03'),
      endsAt: getFutureDate('2022-02-05'),
    })).rejects.toBeInstanceOf(Error);
  })
})
