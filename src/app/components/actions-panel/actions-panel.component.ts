﻿import { Component, inject, OnInit } from '@angular/core';
import { KeyboardToggleComponent } from '../keyboard-toggle';
import { LangSwitcherComponent } from '../lang-switcher';
import { filter, map, Observable, of } from 'rxjs';
import { Keyboard } from '@app/utils/keyb-lang.global';
import { AsyncPipe, NgIf } from '@angular/common';
import { HomeButtonComponent } from '../home-button/home-button.component';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'actions-panel',
  standalone: true,
  template: `
    <home-button *ngIf="showHomeButton$ | async"></home-button>
    <app-keyboard-toggle
      *ngIf="visibleKeybToggle | async"
    ></app-keyboard-toggle>
    <app-lang-switcher></app-lang-switcher>
  `,
  styles: [
    `
      :host {
        position: absolute;
        bottom: 0;
        margin: 10px;
        display: flex;
        align-items: center;
        gap: 5pt;
        flex-direction: column;
        z-index: 2;
      }
    `,
  ],
  imports: [
    NgIf,
    AsyncPipe,
    KeyboardToggleComponent,
    LangSwitcherComponent,
    HomeButtonComponent,
  ],
})
export class ActionsPanelomponent implements OnInit {
  router = inject(Router);
  visibleKeybToggle: Observable<boolean> = Keyboard.visibleKeybToggle;
  showHomeButton$ = of(false);

  ngOnInit(): void {
    this.showHomeButton$ = this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map(() => this.router.url !== '/wellcome')
    );
  }
}
