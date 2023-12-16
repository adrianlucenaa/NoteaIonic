import { Component, Input, OnInit } from '@angular/core';
import { Note } from '../model/note';
import { NoteService } from '../services/note.service';
import { IonicModule, ModalController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-edit-note-modal',
  templateUrl: './edit-note-modal.component.html',
  styleUrls: ['./edit-note-modal.component.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule],
})
export class EditNoteModalComponent  implements OnInit {

  

  @Input() note!: Note;
  public noteS: NoteService;
  img: boolean = false;
  showImage: boolean = false;

  constructor(noteS: NoteService,private modalController: ModalController) {
    this.noteS= noteS;
  }
  ngOnInit(): void {
  }

  saveChanges() {
    console.log('Estado imagen:' + this.img);

    this.noteS.updateNote(this.note)
      .then(() => {
        this.modalController.dismiss();
      })
      .catch((error) => {
        console.error("Error al actualizar la nota:", error);
      });
     
    
    if (this.img) {
      this.note.img = '';
    } 

    console.log(this.note);

    return this.modalController.dismiss(this.note, 'confirm');
  }
  

  close() {
    this.modalController.dismiss();
  }
}