import { array, object, string } from 'yup';

export const SelectedRangeSchema = object({
  from: string().required({ ['period.from']: 'Period heeft een verplichte start datum' }),
  to: string().required({ ['period.to']: 'Period heeft een verplichte eind datum' }),
});

export const SelectedSubscriptionItemSchema = object({
  datum: string().required(),
  hondIds: array(string()).required().min(1),
  timeSlots: array(string()).required().min(1),
});

export const CheckAvailabilitySchema = object({
  serviceId: string().required({ serviceId: 'serviceId is verplicht' }),
  klantId: string().required({ klantId: 'klantId is verplicht' }),
  items: array(SelectedSubscriptionItemSchema).required({
    selectedDays: 'selectedDays is verplicht',
  }),
});

export type CheckAvailabilityType = {
  serviceId: string;
  klantId: string;
  period: { from: string; to: string };
  selectedDays: { weekday: string; dogs: string[]; moments: string[] }[];
};

export const SubscriptionDetailsSchema = object({
  datum: string().required({ datum: 'datum is verplicht' }),
  hondIds: array(string())
    .min(1, { hondIds: 'minimaal 1 hond is verplicht' })
    .required({ hondIds: 'honden zijn verplicht' }),
  timeSlots: array(string())
    .min(1, { timeSlots: 'minimaal 1 timeSlot is verplicht' })
    .required({ timeSlots: 'timeSlots zijn verplicht' }),
  id: string(),
});

export const CreateSubscriptionSchema = object({
  serviceId: string().required({ serviceId: 'serviceId is verplicht' }),
  klantId: string().required({ serviceId: 'klantId is verplicht' }),
  items: array(SubscriptionDetailsSchema),
});
