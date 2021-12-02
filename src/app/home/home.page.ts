import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { PlatziMusicService } from '../services/platzi-music.service';
import { SongModalPage } from '../song-modal/song-modal.page';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  slidesOps = {
    initialSlide: 2,
    slidesPerView: 4,
    centeredSlides: true,
    speed: 400,
  };
  artists: any[] = [];
  songs: any[] = [];
  albums: any[] = [];

  constructor(
    private musicService: PlatziMusicService,
    private modalController: ModalController
  ) {}

  ionViewDidEnter() {
    this.musicService.getNewReleases().then((newReleases) => {
      this.artists = this.musicService.getArtist();
      this.songs = newReleases.albums.items.filter(
        (e) => e.album_type == 'single'
      );
      this.albums = newReleases.albums.items.filter(
        (e) => e.album_type == 'album'
      );
    });
  }

  async showSongs(artist) {
    const songs = await this.musicService.getArtistTopTrack(artist.id);
    const modal = await this.modalController.create({
      component: SongModalPage,
      componentProps: {
        songs: songs.tracks,
        artist: artist.name,
      },
    });

    return await modal.present();
  }
}
