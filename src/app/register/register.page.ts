import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { AuthenticateService } from '../services/authenticate.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  registerForm: FormGroup;
  validation_messages = {
    nombre: [
      { type: 'required', message: 'El nombre es requerido' },
      { type: 'minLength', message: 'minimo 3 letras' },
    ],
    apellido: [
      { type: 'required', message: 'El apellido es requerido' },
      { type: 'minLength', message: 'minimo 3 letras' },
    ],
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
    this.registerForm = this.formBuilder.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      apellido: ['', [Validators.required, Validators.minLength(3)]],
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

  register() {
    this.authenticateService.registerUser(this.registerForm.value).then(() => {
      this.goToLogin();
    });
  }

  goToLogin() {
    this.navCtrl.navigateBack('/login');
  }
}
