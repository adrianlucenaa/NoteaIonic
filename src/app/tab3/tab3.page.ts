import { Component, OnInit } from '@angular/core';
import { ExploreContainerComponent } from '../explore-container/explore-container.component';
import { HttpClient, HttpEventType,HttpClientModule } from '@angular/common/http';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  standalone: true,
  imports: [
    ExploreContainerComponent,
    HttpClientModule,
    IonicModule
  ],
})
export class Tab3Page implements OnInit{
  src = 'https://source.unsplash.com/random';
  url = 'https://api.kanye.rest/';
  mensaje = '';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http
      .get(this.url, { observe: 'events', reportProgress: true })
      .subscribe((e) => {
        let event = e as any;
        if ((event.type as any) == HttpEventType.DownloadProgress) {
          console.log(event.loaded);
          console.log(event.total);
        }
        if (event.type === HttpEventType.Response) {
          console.log(event.body);
          this.mensaje = event.body.quote;
        }
      });
  }
}
