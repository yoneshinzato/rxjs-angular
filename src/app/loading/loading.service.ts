import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class LoadingService {
  loading$: Observable<boolean>;
  // pass the values to the template, is unaware of how other components are structured. just know about the loading observable
  constructor() { }
  
  showLoaderUntilCompleted<T>(obs$: Observable<T>): Observable<T> {
    return undefined;
  }

  loadingOn() {}

  loadingOff() {}

}
