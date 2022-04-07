type Gender = 'M' | 'F';

export interface PinderCard {
  name: string,
  age?: number,
  gender: Gender,
  picture: string,
  info: string,
  matched?: boolean
}
