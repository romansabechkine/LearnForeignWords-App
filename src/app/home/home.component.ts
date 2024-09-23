import { Component } from '@angular/core';
import { Category, Language, Vocabulary } from '../services/types';
import { VocabularyService } from '../services/vocabulary/vocabulary.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  userid: string | null = localStorage.getItem("userid")
  username: string | null = localStorage.getItem("username")

  languages! : Language[]

  categories! : Category[] | undefined

  vocabulary!: Vocabulary[] | undefined

  vocabularyId!: string


  //we will show the categories if user choosed the language
  languageWasChoosen: boolean = false
  categoryWasChoosen: boolean = false

  constructor(
    private vocabularyService: VocabularyService,
    private router: Router
  ) {}

  getLanguages(event:boolean): void{
    if (event){
      // getLanguages(): void{
      console.log("Get languages working")
      console.log(`UserId: ${this.userid}`)
      if (this.userid){
        const res = this.vocabularyService.getLanguages(this.userid)
        res.subscribe(
          (response:Language[]):Language[] => {
            //console.log(`Response in getLanguages: ${response[0].language1}`)
            this.languages = response
            return response
          },
          (error) => {
            console.log("Getting languages error")
            console.log(error)
          })
        } 
      }
    }

    acceptLanguageAndGetCategories(event:Language){
      if (event){
        console.log("acceptLanguageAndGetCategories working")
        this.languageWasChoosen = true
        const language: Language = event
        localStorage.setItem("languagesId", language.id)
        localStorage.setItem("language1", language.language1)
        localStorage.setItem("language2", language.language2)
        const res = this.vocabularyService.getCategories(language.userId, language.id)
        res.subscribe(
          (response:Category[] | undefined):void => {
            console.log(`Response in acceptLanguageAndGetCategories: ${response}`)
            this.categories = response
            console.log(this.categories)
            if (response?.length === 0) {this.categoryWasChoosen = false}
          },
          (error) => {
            console.log("Getting categories error")
            console.log(error)
          })
      }
    }

    acceptCategoryAndGetVocabulary(event:Category){
      if (event) {
        this.categoryWasChoosen = true
        localStorage.setItem("category", event.category)
        const res = this.vocabularyService.getVocabulary(event.userId, event.languagesId, event.id)
        res.subscribe(
          (response:Vocabulary[] | undefined):void => {
            //console.log(`Response in acceptLanguageAndGetCategories: ${response}`)
            this.vocabulary = response
            if (this.vocabulary?.length !== 0 || this.vocabulary !== undefined){
              this.vocabularyId = this.vocabulary![0].id
            } 
          },
          (error) => {
            console.log("Getting vocabulary error")
            console.log(error)
          })

        console.log("voc in home")
        console.log(this.vocabulary)
      }
  }
}

