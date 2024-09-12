import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Course } from '../model/course';
import { map, shareReplay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CoursesService {

  constructor(private http: HttpClient) { }
// service layer return only observables to the view layer. it is stateless, does not hold app data
  loadAllCourses(): Observable<Course[]> {
    return this.http.get<Course[]>('/api/courses')
      .pipe(
        // map create a derived observable
        map(res => res["payload"]),
        // help trigger just 1 httpRequest, avoiding multiple http requests and memory leaks
        shareReplay()
      )

}
}