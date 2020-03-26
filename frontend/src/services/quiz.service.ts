import { Injectable } from '@angular/core';
import { BehaviorSubject , Subject} from 'rxjs';
import { Quiz } from '../models/quiz.model';
import { Theme } from '../models/theme.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { Question } from '../models/question.model';
import { ThemeService } from './theme.service';

@Injectable({
  providedIn: 'root'
})
export class QuizService {
  /**
   * Services Documentation:
   * https://angular.io/docs/ts/latest/tutorial/toh-pt4.html
   */

   /**
    * The list of quiz.
    * The list is retrieved from the mock.
    */
  private quizzes: Quiz[] = [];
  public quizSelected: Quiz;
  public themeSelected: Theme;
  private questions: Question[] = [];

  private lien = "http://localhost:9428/api/themes/";

  /**
   * Observable which contains the list of the quiz.
   * Naming convention: Add '$' at the end of the variable name to highlight it as an Observable.
   */
  public quizzes$: BehaviorSubject<Quiz[]> = new BehaviorSubject(this.quizzes);
  public questions$: BehaviorSubject<Question[]> = new BehaviorSubject(this.questions);

  public quizSelected$: Subject<Quiz> = new Subject();
  public themeSelected$: Subject<Theme> = new Subject();

  constructor(private http: HttpClient, private themeService : ThemeService) {
    //faut laisser le temps a themeService
    setTimeout(() => {
      this.http.get<Quiz[]>(this.lien + this.themeService.themeSelected.id + "/quizzes/").subscribe((quizzess) => {
        this.quizzes = quizzess;
        console.log(quizzess);
        this.quizzes$.next(this.quizzes);
      });
      this.themeService.themeSelected$.subscribe((theme) =>{
        this.themeSelected = theme
        this.themeSelected$.next(this.themeSelected)
      });
    }, 1000);
    //faire une requete vers themeservice avec le themeID
  }

  ngOnInit(){

  }

  setQuizzesFromUrl(){
    this.http.get<Quiz[]>(this.lien + this.themeService.themeSelected.id + "/quizzes/").subscribe((quizzess) => {
      this.quizzes = quizzess;
      console.log(quizzess)
      this.quizzes$.next(this.quizzes);
    });

  }

  /** DELETE: delete the quiz from the server */
  deleteQuiz (id : string,quiz: Quiz): Observable<{}> {
    const url = this.lien+this.themeSelected.id+"/quizzes/"+quiz.id; // DELETE api/heroes/42
    const header = this.prepareHeader();
    this.quizzes$.next(this.quizzes)
    return this.http.delete(url,header)
  }

  /** Header for deleting: allow deleting from the server */
  protected prepareHeader(): object {
    const headers = new HttpHeaders(
      {'Content-Type': 'application/json',
        'Access-Control-Allow-Origin' : '*'
      });

    return {
        headers: headers
    };
  }

  setSelectedQuiz(lequiz: string) {
    console.log("gooo")
    console.log(this.themeService.themeSelected.id.toString())
    console.log(lequiz.toString())
    const urlWithId = this.lien + this.themeService.themeSelected.id.toString() + '/quizzes/' + lequiz.toString();
    this.http.get<Quiz>(urlWithId).subscribe((quiz) => {
      console.log("Le selected"+quiz);
      this.quizSelected = quiz;
      this.quizSelected$.next(quiz);
    });

  }

  getQuizById(id: string): Observable<Quiz> {
    return of(this.quizzes.filter((quiz) => quiz.id.toString() === id)[0]);
  }

  addQuiz(id: string,quiz: Quiz): void {
    this.http.post(this.lien+id.toString()+"/quizzes/",quiz).subscribe((quiz) => {this.setQuizzesFromUrl()})
    this
  }


  addQuestion(question: Question){
    //le .subscribe() est TRES IMPORTANT sinon fonctionne pas
    this.http.post<Question>(this.lien+ this.themeService.themeSelected.id +"/quizzes/"+this.quizSelected.id+"/questions/",question).subscribe((question)=> this.quizSelected.questions.push(question))
    this.questions$.next(this.questions);
  }

  deleteQuestion(quiz: Quiz, question: Question){
    const url = this.lien + this.themeService.themeSelected.id.toString() + "/quizzes/" +quiz.id+"/questions/"+question.id.toString(); // DELETE api/heroes/42
    const header = this.prepareHeader();
    this.quizzes$.next(this.quizzes);
    this.http.delete(url,header).subscribe(()=> console.log("suppr"))
    this.quizzes$.next(this.quizzes);
    
  }
}
