import { BookingFirstEventHandler } from './booking.first.event.handler';
import { BookingsFourthEventHandler } from './bookings.fourth.event.handler';
import { BookingFifthEventHandler } from './booking.fifth.event.handler';
import { BookingSecondEventHandler } from './booking.second.event.handler';
import { BookingThirdEventHandler } from './booking.third.event.handler';

export const BookingCommandHandlers = [
  BookingFirstEventHandler,
  BookingSecondEventHandler,
  BookingThirdEventHandler,
  BookingsFourthEventHandler,
  BookingFifthEventHandler,
];
