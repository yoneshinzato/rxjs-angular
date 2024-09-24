import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { Course, sortCoursesBySeqNo } from '../model/course';
import { catchError, map, shareReplay, tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { MessagesService } from '../messages/messages.service';
import { LoadingService } from '../loading/loading.service';

@Injectable({ 
    providedIn: 'root'
 })


export class CoursesStore {
    // remember the last value emitted by courses$
    private subject = new BehaviorSubject<Course[]>([]);
    courses$: Observable<Course[]> = this.subject.asObservable();

    constructor(
        private http: HttpClient,
        private loading: LoadingService,
        private messages: MessagesService

    ) { 
        this.loadAllCourses();}

    filterByCategory(category: string): Observable<Course[]> {
        return this.courses$.pipe(
            map(courses =>
                    courses.filter(course => course.category == category)
                        .sort(sortCoursesBySeqNo)
            )
        )
    }

    saveCourse(courseId: string, changes: Partial<Course>): Observable<any> {
        // update data in memory, in the client side, getValue - gets the last value emitted
        const courses = this.subject.getValue();

        const index = courses.findIndex(course => course.id == courseId);
        // only exists in memory
        const newCourse: Course = {
            ...courses[index],
            ...changes
        }
        // create a copy of the courses array above
        const newCourses: Course[] = courses.slice(0)   

        newCourses[index] = newCourse;

        // trigger a save to the backend, application reflect these changes immediately
        this.subject.next(newCourses);

        return this.http.put(`/api/courses/${courseId}`, changes)
            .pipe(
                catchError(err => {
                    const message = "Could not save course";
                    console.log(message, err);
                    this.messages.showErrors(message);
                    return throwError(err)
                }),
                shareReplay()
            )
    }

    private loadAllCourses() {
       const loadCourses$ = this.http.get<Course[]>('/api/courses')
            .pipe(
                map(response => response['payload']),
                catchError(err => {
                    const message = "Could not load courses";
                    this.messages.showErrors(message);
                    console.log(message, err);
                    return throwError(err);
                }),
                tap(courses => this.subject.next(courses))
            )
            this.loading.showLoaderUntilCompleted(loadCourses$)
                .subscribe()

    }
}   