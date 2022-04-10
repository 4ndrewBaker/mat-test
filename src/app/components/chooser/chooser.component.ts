import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnInit,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { PinderCard } from '../../interfaces/Card.intrface';
import { BehaviorSubject, Observable, switchMap } from 'rxjs';

@Component({
  selector: 'app-chooser',
  templateUrl: './chooser.component.html',
  styleUrls: ['./chooser.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChooserComponent implements OnInit, AfterViewInit {
  gUnit = 22;
  cardsLoaded$ = new BehaviorSubject(false);
  cards$ = this.cardsLoaded$.pipe(
    switchMap(() => this.getPinderCards()),
  );

  @ViewChildren('pinderCard')
  public pinderCards!: QueryList<ElementRef>;

  constructor(
    private httpClient: HttpClient,
  ) {
  }

  ngOnInit(): void {
    this.getCards();
  }

  ngAfterViewInit() {
    /*this.pinderCardsArray = this.pinderCards.toArray();
    this.pinderCards.changes.subscribe(() => {
      this.pinderCardsArray = this.pinderCards.toArray();
    });*/
  };

  public getPinderCards(): Observable<PinderCard[]> {
    return this.httpClient.get<PinderCard[]>('/assets/data.json');
  }

  public getCards(): void {
    this.cardsLoaded$.next(true);
  }

}
