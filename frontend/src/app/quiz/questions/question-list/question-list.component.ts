import { Component, OnInit, Input, ElementRef } from '@angular/core';
import { QuizService } from '../../../../services/quiz.service';
import { Question } from '../../../../models/question.model';
//router
import { ActivatedRoute, Router } from "@angular/router";
import { Quiz } from 'src/models/quiz.model';
@Component({
  selector: 'app-question-list',
  templateUrl: './question-list.component.html',
  styleUrls: ['./question-list.component.scss']
})
export class QuestionListComponent {

  public searchQuestion: string;

  @Input()
  quiz:Quiz

  constructor(private elementRef: ElementRef, private router:Router, public quizService: QuizService) {
  }

  questionDeletion(question: Question) {
    this.quizService.deleteQuestion(this.quiz.themeId,this.quiz, question);
    this.quiz.questions.splice(this.quiz.questions.indexOf(question),1)
  }

  questionEdition(selected: Question){
    this.router.navigate(["theme-edit",this.quiz.themeId,"edit-quiz",this.quiz.id.toString(),"edit-question",selected.id.toString()]) 
  }

  clickSearch(){
    var _searchContainers = this.elementRef.nativeElement.querySelector('.expandSearch');
    if(_searchContainers.className === "expandSearch"){
        _searchContainers.classList.add("expandSearch");
        _searchContainers.classList.add("showSearch")
    }else{
        _searchContainers.classList.remove("showSearch")
    }
}   
}