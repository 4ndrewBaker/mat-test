type Gender = 'M' | 'F';

export interface PinderCard {
  nick_name: string,
  age?: number,
  gender: Gender,
  picture: string,
  info: string,
  is_matched?: boolean
}
