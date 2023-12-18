import { Component,ViewChild,inject } from '@angular/core';
import { IonicModule, ModalController, Platform } from '@ionic/angular';
import { NoteService } from '../services/note.service';
import { Note } from '../model/note';
import { CommonModule } from '@angular/common';
import { EditNoteModalComponent } from '../edit-note-modal/edit-note-modal.component';
import { AlertController } from '@ionic/angular';
import { BehaviorSubject, Observable, from, map, mergeMap, tap, toArray } from 'rxjs';


@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class Tab2Page {
  //public misnotas:Note[]=[];
  public _notes$:BehaviorSubject<Note[]> = new BehaviorSubject<Note[]>([]);
  private lastNote:Note|undefined=undefined;
  private notesPerPage:number = 15;
  public isInfiniteScrollAvailable:boolean = true;


  public _editNote!:Note;
  public _deleteNote!:Note;

  

  constructor(public platform:Platform,
     public noteS: NoteService, 
     public modalController: ModalController, 
     private alertController: AlertController ) {
    console.log("CONS")
  }
  



  async editNote($event: Note) {
    this._editNote = $event;
  
    const modal = await this.modalController.create({
      component: EditNoteModalComponent,
      componentProps: {
        note: $event
      }
    });
  
    await modal.present();
  }

  deleteNoteSliding(note: Note) {
    this.deleteNote(note);
  }
  ionViewDidEnter(){
    this.platform.ready().then(() => {
      console.log(this.platform.height());
      this.notesPerPage=Math.round(this.platform.height()/50);
      this.loadNotes(true);
    });
   
  }


  loadNotes(fromFirst: boolean, event?: any) {
    if (fromFirst) {
      // Cargar las notas desde el principio
      this.noteS.getNotes().subscribe((notes: Note[]) => {
        this._notes$.next(notes);
        if (event) {
          event.target.complete();
        }
      });
    } else if (this.lastNote) {
      // Cargar más notas utilizando la última nota como referencia
      this.noteS.getMoreNotes(this.lastNote).subscribe((notes: Note[]) => {
        const currentNotes = this._notes$.getValue();
        this._notes$.next([...currentNotes, ...notes]);
        if (event) {
          event.target.complete();
        }
      });
    } else {
      // No hay más notas disponibles
      this.isInfiniteScrollAvailable = false;
      if (event) {
        event.target.complete();
      }
    }
  }
  private convertPromiseToObservableFromFirebase(promise: Promise<any>): Observable<Note[]> {
    return from(promise).pipe(
      tap(d=>{
        if(d.docs && d.docs.length>=this.notesPerPage){
          this.lastNote=d.docs[d.docs.length-1];
        }else{
          this.lastNote=undefined;
        }
      }),
      mergeMap(d =>  d.docs),
      map(d => {
        return {key:(d as any).id,...(d as any).data()};
      }),
      toArray()
    );
  }
  async deleteNote($event: Note) {
    const confirmAlert = await this.alertController.create({
      header: 'Confirmar Eliminación',
      message: '¿Estás seguro de que deseas eliminar esta nota?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
        },
        {
          text: 'Eliminar',
          handler: () => {
            this._deleteNote = $event;
            if (this.noteS && typeof this.noteS.deleteNote === 'function') {
              this.noteS.deleteNote($event).then(() => {
                console.log('Nota eliminada exitosamente');
              }).catch((error) => {
                console.error('Error al eliminar la nota:', error);
              });
            } else {
              console.error('noteS.deleteNote no es una función');
            }
          },
        },
      ],
    });
  
    await confirmAlert.present();
  }
 
  doRefresh(event: any) {
    this.isInfiniteScrollAvailable=true;
    this.loadNotes(true,event);
  }

  loadMore(event: any) {
    this.loadNotes(false,event);
  }
}