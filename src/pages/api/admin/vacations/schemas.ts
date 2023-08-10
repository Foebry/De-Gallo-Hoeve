import { array, date, object, string } from 'yup';

export const VacationSchema = object({
  duration: object({
    from: date().required({
      from: 'isRequired',
      message: 'Gelieve all verplichte velden (*) in te vullen',
    }),
    to: date().required({
      to: 'isRequired',
      message: 'Gelieve alle verplichte velden (*) in te vullen',
    }),
  }),
  notificationStartDate: date(),
});
