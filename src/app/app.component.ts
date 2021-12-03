import { Component } from '@angular/core';

import { Storage } from '@ionic/storage-angular';
import * as mapboxgl from 'mapbox-gl';

import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(private storage: Storage) {}

  async ngOnInit(): Promise<void> {
    await this.storage.create();
    (mapboxgl as any).accessToken = environment.mapboxToken;
  }
}
