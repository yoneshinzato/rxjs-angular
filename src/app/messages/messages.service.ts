import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter } from 'rxjs/operators';

@Injectable()
export class MessagesService {

  // armazena ultimo valor emitido e emite o valor para novos assinantes
  private subject = new BehaviorSubject<string[]>([]); 

// expõe behaviorsubject como observable, permitindo que outros componentes se inscrevam pra receber atualizações sobre os erros
  errors$: Observable<string[]> = this.subject.asObservable().pipe(
    filter(messages => messages && messages.length > 0)
  ); 

  constructor() { }

  showErrors(...errors: string[]) {
    this.subject.next(errors)
  }

}
