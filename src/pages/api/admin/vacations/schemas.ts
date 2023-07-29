import { array, date, object, string } from 'yup';

export const VacationSchema = object({
  startDate: date().required({
    startDate: 'isRequired',
    message: 'Gelieve alle verplichte velden (*) in te vullen',
  }),
  endDate: date().required({
    endDate: 'isRequired',
    message: 'Gelieve alle verplichte velden (*) in te vullen.',
  }),
  notificationStartDate: date().required({
    notificationStartDate: 'isRequired',
    message: 'Gelieve alle verplichte velden (*) in te vullen',
  }),
  longDescription: array(string()).optional(),
  notificationDescription: string().optional(),
});
