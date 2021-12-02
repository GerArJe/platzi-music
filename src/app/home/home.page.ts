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
  song: {
    preview_url: string;
    playing: boolean;
    name: string;
  } = {
    preview_url: '',
    playing: false,
    name: '',
  };
  currentSong: HTMLAudioElement;
  newTime: number;

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

  async showSongs(artist?, album?) {
    let songs;
    if (artist) {
      songs = await this.musicService.getArtistTopTrack(artist.id);
    } else {
      songs = await this.musicService.getAlbumTracks(album.id);
    }
    const modal = await this.modalController.create({
      component: SongModalPage,
      componentProps: {
        songs: songs?.tracks ?? songs?.items,
        artist: artist ? true : false,
        title: artist?.name ?? album.name,
      },
    });
    modal.onDidDismiss().then((dataReturned) => {
      this.song = dataReturned.data;
    });
    return await modal.present();
  }

  play() {
    this.currentSong = new Audio(this.song.preview_url);
    this.currentSong.play();
    this.currentSong.addEventListener('timeupdate', () => {
      this.newTime =
        (this.currentSong.currentTime * (this.currentSong.duration / 10)) / 100;
    });
    this.song.playing = true;
  }

  pause() {
    this.currentSong.pause();
    this.song.playing = false;
  }

  parseTime(time: number) {
    if (time) {
      const partTime = parseInt(time.toString().split('.')[0], 10);
      let minutes = Math.floor(partTime / 60).toString();
      if (minutes.length == 1) {
        minutes = '0' + minutes;
      }
      let seconds = (partTime % 60).toString();
      if (seconds.length == 1) {
        seconds = '0' + seconds;
      }
      return minutes + ':' + seconds;
    }
  }
}
