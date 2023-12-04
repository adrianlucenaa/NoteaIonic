import { Component,inject } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { NoteService } from '../services/note.service';
import { Note } from '../model/note';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: true,
  imports: [IonicModule,CommonModule]
})
export class Tab2Page {
  //public misnotas:Note[]=[];
  public noteS = inject(NoteService);  //noteS.notes$
  constructor() {}

  ionViewDidEnter(){
    /*this.misnotas=[];
    this.noteS.readAll().subscribe(d=>{
      console.log(d)
      d.docs.forEach((el:any) => {
        this.misnotas.push({'key':el.id,...el.data()});
      });
    })*/
  }

  editNote(){

  }
  deleteNote(){

  }

}
