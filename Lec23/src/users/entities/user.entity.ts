export type Gender = 'male' | 'female' | 'other';

export class User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  gender: Gender;
  subscriptionStartDate: Date;
  subscriptionEndDate: Date;
}
