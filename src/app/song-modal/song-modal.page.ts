import { Component } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';

@Component({
  selector: 'app-song-modal',
  templateUrl: './song-modal.page.html',
  styleUrls: ['./song-modal.page.scss'],
})
export class SongModalPage {
  songs: any[] = [];
  artist: string;

  constructor(
    private navParams: NavParams,
    private modalController: ModalController
  ) {}

  ionViewDidEnter() {
    this.songs = this.navParams.data.songs;
    console.log(this.songs);
    this.artist = this.navParams.data.artist;
  }

  async selectSong(song?) {
    await this.modalController.dismiss(song);
  }
}
