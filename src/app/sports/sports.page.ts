import { Component } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import { Geolocation } from '@capacitor/geolocation';
import { PlatziMusicService } from '../services/platzi-music.service';

@Component({
  selector: 'app-sports',
  templateUrl: './sports.page.html',
  styleUrls: ['./sports.page.scss'],
})
export class SportsPage {
  currentCenter: any;
  coordinates: any[] = [];
  defaultZoom: number = 14;
  map!: mapboxgl.Map;
  marker: mapboxgl.Marker;
  polylines: any[] = [];
  songs: any[] = [];
  loading: boolean = false;
  currentSong: {
    preview_url: string;
    playing: boolean;
    name: string;
    audio: HTMLAudioElement;
  } = {
    preview_url: '',
    playing: false,
    name: '',
    audio: null,
  };

  constructor(private platziMusicService: PlatziMusicService) {}

  async ionViewDidEnter() {
    await this.getCurrentPosition();
    this.map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [this.currentCenter.lng, this.currentCenter.lat],
      zoom: this.defaultZoom,
    });
    this.watchPosition();
    this.addMarker();
  }

  async getCurrentPosition() {
    const coordinates = await Geolocation.getCurrentPosition();
    this.currentCenter = {
      lat: coordinates.coords.latitude,
      lng: coordinates.coords.longitude,
    };
  }

  watchPosition() {
    Geolocation.watchPosition({}, (position) => {
      this.currentCenter = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };
      this.map.flyTo({
        center: [this.currentCenter.lng, this.currentCenter.lat],
        essential: true,
        zoom: 15,
      });
      this.addMarker();
      this.getRoute();
    });
  }

  getRoute() {
    this.polylines.push([this.currentCenter.lng, this.currentCenter.lat]);
    const geojson = {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'LineString',
        coordinates: this.polylines,
      },
    };

    if (this.map.getSource('route')) {
      this.map.getSource('route').setData(geojson);
    } else {
      this.map.addLayer({
        id: 'route',
        type: 'line',
        source: {
          type: 'geojson',
          data: geojson,
        },
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
        },
        paint: {
          'line-color': '#3887be',
          'line-width': 5,
          'line-opacity': 0.75,
        },
      });
    }
  }

  addMarker() {
    const el = document.createElement('div');
    const width = 60;
    const height = 60;
    el.className = 'marker';
    el.style.backgroundImage = `url(assets/img/bicycle.png)`;
    el.style.width = `${width}px`;
    el.style.height = `${height}px`;
    el.style.backgroundSize = '100%';

    this.marker?.remove();
    this.marker = new mapboxgl.Marker(el)
      .setLngLat([this.currentCenter.lng, this.currentCenter.lat])
      .addTo(this.map);
  }

  searchTracks(event) {
    this.loading = true;
    const query = event.detail.value;

    if (!query) {
      this.pause();
      this.loading = false;
      return;
    }

    this.platziMusicService.searchTracks(query).then(
      (resp) => {
        this.songs = [];
        resp.tracks.items.forEach((song) => {
          if (song.preview_url) {
            this.songs.push(song);
          }
        });

        this.loading = false;
      },
      (error) => {
        this.loading = false;
      }
    );
  }

  play(song) {
    this.pause();
    this.currentSong = song;
    this.currentSong.audio = new Audio(this.currentSong?.preview_url);
    this.currentSong.audio.play();
    this.currentSong.playing = true;
  }

  pause() {
    this.currentSong.audio?.pause();
    this.currentSong.playing = false;
  }
}
