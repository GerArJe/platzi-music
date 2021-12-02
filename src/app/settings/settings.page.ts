import { Component } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage {
  userImage =
    'https://concepto.de/wp-content/uploads/2018/08/persona-e1533759204552.jpg';
  photo: SafeResourceUrl;

  constructor(private domSanitizer: DomSanitizer) {}

  async takePhoto() {
    const image = await Camera.getPhoto({
      quality: 100,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Camera,
    });
    this.photo = this.domSanitizer.bypassSecurityTrustResourceUrl(
      image && image.dataUrl
    );
  }
}
