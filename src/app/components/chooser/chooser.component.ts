import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnInit,
  QueryList,
  Renderer2,
  ViewChildren,
} from '@angular/core';

import { BehaviorSubject, switchMap, tap } from 'rxjs';
import 'hammerjs';

import { CardService } from '../../services/cards.service';
import { PinderCard } from 'src/app/interfaces/card.intrface';

@Component({
  selector: 'app-chooser',
  templateUrl: './chooser.component.html',
  styleUrls: ['./chooser.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChooserComponent implements OnInit, AfterViewInit {
  gUnit = 22;
  moveOutWidth: number = 0;
  shiftRequired: boolean = false;
  transitionInProgress: boolean = false;
  isLike: boolean = false;
  isDislike: boolean = false;
  isMatched: boolean = false;
  pinderCardsArray: Array<ElementRef> = [];
  cardsLoaded$ = new BehaviorSubject(false);
  cards: PinderCard[] = [];
  cards$ = this.cardsLoaded$.pipe(
    switchMap(() => this.cardService.getPinderCards()),
  ).pipe(
    tap((res) => {
      this.cards = res;
    }),
  );

  @ViewChildren('pinderCard')
  public pinderCards!: QueryList<ElementRef>;

  constructor(
    private cardService: CardService,
    private renderer: Renderer2,
  ) {
  }

  ngOnInit(): void {
    this.getCards();
  }

  ngAfterViewInit() {
    this.moveOutWidth = document.documentElement.clientWidth * 1.5;

    this.pinderCardsArray = this.pinderCards.toArray();
    this.pinderCards.changes.subscribe(() => {
      this.pinderCardsArray = this.pinderCards.toArray();
    });
  };

  public isMatchedHandle(match: boolean): void {
    if (!this.cards.length) return;
    this.isMatched = match;
  }

  private toggleReaction(like: boolean, dislike: boolean) {
    this.isLike = like;
    this.isDislike = dislike;
  };

  public getCards(): void {
    this.cardsLoaded$.next(true);
  }

  public handleShift() {
    this.transitionInProgress = false;
    this.toggleReaction(false, false);

    if (this.shiftRequired) {
      this.shiftRequired = false;
      this.cards.shift();
    }
  };

  public handlePan(event: any): void {
    if (
      event.deltaX === 0 ||
      ( event.center.x === 0 && event.center.y === 0 ) ||
      !this.cards.length
    ) return;

    if (this.transitionInProgress) {
      this.handleShift();
    }

    this.renderer.addClass(this.pinderCardsArray[0].nativeElement, '--moved');

    if (event.deltaX > 0) {
      this.toggleReaction(false, true);
    } else {
      this.toggleReaction(true, false);
    }

    const xMulti = event.deltaX * 0.03;
    const yMulti = event.deltaY / 80;
    let rotate = xMulti * yMulti;

    this.renderer.setStyle(
      this.pinderCardsArray[0].nativeElement,
      'transform', 'translate(' + event.deltaX + 'px, ' + event.deltaY + 'px) rotate(' + rotate + 'deg)',
    );

    this.shiftRequired = true;
  }

  public handlePanEnd(event: any): void {
    if (!this.cards) return;

    const keep = Math.abs(event.deltaX) < 80 || Math.abs(event.velocityX) < 0.5;

    if (keep) {
      this.renderer.setStyle(this.pinderCardsArray[0].nativeElement, 'transform', 'none');
      this.renderer.removeClass(this.pinderCardsArray[0].nativeElement, '--moved');
      this.shiftRequired = false;
    } else {
      const endX = Math.max(Math.abs(event.velocityX) * this.moveOutWidth, this.moveOutWidth);
      const toX = event.deltaX > 0 ? endX : -endX;
      const endY = Math.abs(event.velocityY) * this.moveOutWidth;
      const toY = event.deltaY > 0 ? endY : -endY;
      const xMulti = event.deltaX * 0.03;
      const yMulti = event.deltaY / 80;
      const rotate = xMulti * yMulti;

      this.renderer.setStyle(
        this.pinderCardsArray[0].nativeElement,
        'transform', 'translate(' + toX + 'px, ' + ( toY + event.deltaY ) + 'px) rotate(' + rotate + 'deg)',
      );

      this.renderer.removeClass(this.pinderCardsArray[0].nativeElement, '--moved');
      this.isMatchedHandle(!!this.cards[0]?.matched && this.isLike);
      this.shiftRequired = true;
    }

    this.transitionInProgress = true;
  }

  public clickedButtonHandle(event: any, liked: boolean): void {
    if (!this.cards.length) return;

    this.pinderCardsArray[0].nativeElement.style.transition = 'all .5s ease-in-out';

    if (liked) {
      this.pinderCardsArray[0].nativeElement.style.transform = 'translate(-' + this.moveOutWidth + 'px, -120px) rotate(10deg)';
      this.toggleReaction(true, false);
    } else {
      this.pinderCardsArray[0].nativeElement.style.transform = 'translate(' + this.moveOutWidth + 'px, -120px) rotate(-10deg)';
      this.toggleReaction(false, true);
    }

    this.isMatchedHandle(!!this.cards[0]?.matched && this.isLike);

    this.shiftRequired = true;
    this.transitionInProgress = true;
  }

}
