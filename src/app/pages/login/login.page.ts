import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';

import { FirecloudService } from '../../services/firecloud.service';
import { FireauthService } from '../../services/fireauth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  // Declaraciones
  title = 'Login';
  correo: string;
  clave: string;
  mensaje: string;

  constructor(
    private login: FirecloudService,
    private authServise: FireauthService,
    private router: Router,
    private platform: Platform
  ) {}

  ngOnInit() {
    this.clave = '';
    this.correo = '';
    this.mensaje = '';
  }

  loguear(user: string) {
    switch (user) {
      case 'admin': {
        this.correo = 'admin@admin.com';
        this.clave = '111111';
        break;
      }
      case 'invitado': {
        this.correo='invitado@invitado.com';
        this.clave='222222';
        break;
      }
      case 'usuario': {
        this.correo='usuario@usuario.com';
        this.clave='333333';
        break;
      }
      case 'anonimo': {
        this.correo='anonimo@anonimo.com';
        this.clave='444444';
        break;
      }
      case 'tester': {
        this.correo='tester@tester.com';
        this.clave='555555';
        break;
      }
    }
  }

  public register(): void {
    this.createUserFireBase(this.correo, this.clave);
  }

  public validarCorreoClave(): void {
    if (this.correoValido(this.correo)) {
      if (this.clave !== '' && this.clave !== undefined) {
        this.authServise
          .logueoConEmailYClave(this.correo, this.clave)
          .then((resp) => {
            this.ngOnInit();
            this.router.navigate(['/bienvenido']);
          })
          .catch((error) => {
            console.log(error.code);
            switch (error.code) {
              case 'auth/invalid-email':
                this.mensaje = 'Correo con formato incorrecto';
                break;
              case 'auth/wrong-password':
                this.mensaje = 'Clave incorrecta';
                break;
              case 'auth/user-not-found':
                this.mensaje = 'El usuario no existe.';
                break;
              default:
                this.mensaje = error.message;
            }
          });
      } else {
        this.mensaje = 'Por favor ingrese una clave';
      }
    } else {
      this.mensaje = 'Por favor ingrese un correo v\u00E1lido';
    }
  }

  private createUserFireBase(email: string, password: string) {
    this.authServise
      .register(email, password)
      .then((res) => {
        console.log(res);

        this.mensaje = 'Registro exitoso.';
        this.router.navigate(['login']);
      })
      .catch((error) => {
        console.log(error);
        switch (error.code) {
          case 'auth/weak-password':
            this.mensaje = 'La clave debe poseer al menos 6 caracteres';
            break;
          case 'auth/email-already-in-use':
            this.mensaje = 'Correo ya registrado';
            break;
          case 'auth/invalid-email':
            this.mensaje = 'Correo con formato inv\u00E1lido';
            break;
          case 'auth/argument-error':
            this.mensaje = 'Correo con debe ser una cadena v\u00E1lida';
            break;
          default:
            this.mensaje = 'Error en registro';
        }
      });
  }

  correoValido(correo: string) {
    let ret = true;
    if (correo !== '' && correo !== undefined) {
      if (!correo.includes('@')) {
        ret = false;
      }
    } else {
      ret = false;
    }

    return ret;
  }

  save(event): any {
    this.validarCorreoClave();
  }


  


}
