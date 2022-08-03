import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

interface NavigationDisabled {
  forwardDisabled: boolean;
  backDisabled: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class NetworkService {
  constructor() {}

  navigationDisabled: Subject<NavigationDisabled> =
    new Subject<NavigationDisabled>();

  checkBoxUpdate: Subject<string> = new Subject<string>();

  handleDisability(historyIndex: number, historyLength: number) {
    let navigationDisabled: NavigationDisabled = {
      forwardDisabled: historyIndex + 1 === historyLength,
      backDisabled: historyIndex === 0,
    };
    this.navigationDisabled.next(navigationDisabled);
  }

  updateCheckBox(checkBox: string) {
    this.checkBoxUpdate.next(checkBox);
  }
}
