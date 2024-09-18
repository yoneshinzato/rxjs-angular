import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class LoadingService {
  // with subject you can define exactly when de observable can emit the values true or false
  private loadingSubject = new BehaviorSubject<boolean>(false);

  // only the loading$ observable has controle over the loadingSubject
  loading$: Observable<boolean> = this.loadingSubject.asObservable();

  // pass the values to the template, is unaware of how other components are structured. just know about the loading observable
  constructor() { }

  showLoaderUntilCompleted<T>(obs$: Observable<T>): Observable<T> {
    return undefined;
  }

  loadingOn() {
    this.loadingSubject.next(true);
  }

  loadingOff() {
    this.loadingSubject.next(false);
  }

}
