import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { AuthenticateService } from '../services/authenticate.service';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  loginForm: FormGroup;
  validation_messages = {
    email: [
      { type: 'required', message: 'El email es requerido' },
      { type: 'pattern', message: 'ojo! este no es un email válido' },
    ],
    password: [
      { type: 'required', message: 'El password es requerido' },
      { type: 'minLength', message: 'minimo 5 letras pra el password' },
    ],
  };
  errorMessage: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private authenticateService: AuthenticateService,
    private navCtrl: NavController,
    private storage: Storage
  ) {
    this.loginForm = this.formBuilder.group({
      email: [
        '',
        [
          Validators.required,
          Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$'),
        ],
      ],
      password: ['', [Validators.required, Validators.minLength(5)]],
    });
  }

  ngOnInit() {}

  loginUser() {
    this.authenticateService
      .loginUser(this.loginForm.value)
      .then((response) => {
        this.errorMessage = '';
        this.storage.set('isUserLoggedIn', true);
        this.navCtrl.navigateForward('/menu/home');
      })
      .catch((error) => {
        this.errorMessage = error;
      });
  }

  goToRegister() {
    this.navCtrl.navigateForward('/register');
  }
}
