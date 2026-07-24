export type Gender = 'male' | 'female' | 'other';

export enum GenderFilter {
  MALE = 'm',
  FEMALE = 'f',
  OTHER = 'o',
}

export const genderFilterMap: Record<GenderFilter, Gender> = {
  [GenderFilter.MALE]: 'male',
  [GenderFilter.FEMALE]: 'female',
  [GenderFilter.OTHER]: 'other',
};

export class User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  gender: Gender;
}
