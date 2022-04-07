import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { PinderCard } from '../interfaces/card.intrface';

@Injectable({
  providedIn: 'root',
})
export class CardService {
  constructor(
    private httpClient: HttpClient,
  ) {
  }

  public getPinderCards(): Observable<PinderCard[]> {
    return this.httpClient.get<PinderCard[]>('/assets/data.json');
  }
}
