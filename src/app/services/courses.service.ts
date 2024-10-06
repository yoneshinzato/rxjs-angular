import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Course } from '../model/course';
import { map, shareReplay } from 'rxjs/operators';
import { Lesson } from '../model/lesson';

@Injectable({
  providedIn: 'root'
})
export class CoursesService {

  constructor(private http: HttpClient) { }

  loadCourseById(courseId: number): Observable<Course> {
    return this.http.get<Course>(`/api/courses/${courseId}`)
      .pipe(
        shareReplay()
      )
  }

  loadAllCourseLessons(courseId: number): Observable<Lesson[]> {
    return this.http.get<Lesson[]>('/api/lessons', {
      params: {
        pageSize: "10000",
        courseId: courseId.toString(),
        
      }
    })
      .pipe(
        map(res => res["payload"]),
        shareReplay()
      )
  }

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

searchLessons(searchString: string): Observable<Lesson[]> {
  return this.http.get<Lesson[]>('/api/lessons', {
    params: {
      filter: searchString,
      pageSize: "100",
    }
  })
    .pipe(
      map(res => res["payload"]),
      shareReplay()
    )
}

saveCourse(courseId: string, changes: Partial<Course>): Observable<any> {
  return this.http.put(`/api/courses/${courseId}`, changes)
    .pipe(
      shareReplay()
    )
} 
}