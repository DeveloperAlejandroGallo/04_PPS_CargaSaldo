import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { User } from 'src/app/class/user';
import { FireauthService } from 'src/app/services/fireauth.service';
import { FirecloudService } from 'src/app/services/firecloud.service';

@Component({
  selector: 'app-bienvenido',
  templateUrl: './bienvenido.page.html',
  styleUrls: ['./bienvenido.page.scss'],
})
export class BienvenidoPage implements OnInit {
  user: User;
  creditosUsuario: Array<number>;
  esAdmin: boolean;
  saldo: number;
  mensaje: string;


  constructor(private firecloud: FirecloudService,
              private fireAuth: FireauthService,
              private router: Router,
              private barcodeScanner: BarcodeScanner) {

      fireAuth.currentUser().then(resp => {
        if (resp != null)
          this.user.email = resp.email;
        
        firecloud.readCollection('creditos').subscribe((res: any) => {
          this.creditosUsuario = [];
          for (let index = 0; index < res.length; index++) {
            const monto = res[index];
            if (resp.email == monto.payload.doc.id) {
              if (resp.email == 'admin@admin.com')
                this.esAdmin = true;
              this.creditosUsuario = monto.payload.doc.data().cargas;
            }
          }
          this.calcularCreditoTotal();    
        });
      }).catch(error => {
          console.error(error);
      });            
  }
  title = 'Carga de Saldo';
  ngOnInit() {
    this.user = new User();
    this.saldo = 0;
  }

  private calcularCreditoTotal() {
    console.log(this.creditosUsuario);
    this.saldo = 0;
    this.creditosUsuario.forEach(monto => {
      this.saldo += monto;
    });
  }


  cargarSaldo() {
    this.barcodeScanner.scan().then(barcodeData => {
      console.log('Barcode data', barcodeData);

        let aCargar = 0;
        switch(barcodeData.text) {
          case '8c95def646b6127282ed50454b73240300dccabc':
              aCargar = 10;
            break;
            case 'ae338e4e0cbb4e4bcffaf9ce5b409feb8edd5172':
              aCargar = 50;
              break;
              case '2786f4877b9091dcad7f35751bfcf5d5ea712b2f':
                aCargar = 100;
                break;
              }
              //verificar si a cargar existe con filter y hacerle el count con 1 para todos menos adm q es 2
              let cant = this.creditosUsuario.filter(elem => elem == aCargar).length;
              if (cant == 0 || (this.esAdmin && cant == 1)) {
                this.creditosUsuario.push(aCargar);
              }
              else 
              {
                this.mensaje = 'Cargar ya realizada';
              }
     }).catch(err => {
         console.log('Error', err);
        //  alert('ERROR:' + err);
     });
    // alert('Guardando carga' + this.creditosUsuario[0]); 
    this.firecloud.nuevaCarga(this.user.email, this.creditosUsuario);
  }

  public limpiar() {
    this.creditosUsuario = [];
    this.firecloud.nuevaCarga(this.user.email, this.creditosUsuario);
  }

  public salir() {
    this.fireAuth.logout();
    this.router.navigate(['/login']);
  }

}
