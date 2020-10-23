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
              this.calcularCreditoTotal();
  
            }
          }
  
        });
  
      }).catch(error => {
  
      });                

  }
  title = 'Carga de Saldo';
  ngOnInit() {
    this.user = new User();
    this.saldo = 0;
  }

  public calcularCreditoTotal() {
    this.creditosUsuario.forEach(monto => {
      this.saldo += monto;
    });
  }


  cargarSaldo() {
    this.barcodeScanner.scan().then(barcodeData => {
      console.log('Barcode data', barcodeData);
      alert(barcodeData.text);
      switch(barcodeData.text) {
        case '8c95def646b6127282ed50454b73240300dccabc':
          this.creditosUsuario.push(10);
          break;
        case 'ae338e4e0cbb4e4bcffaf9ce5b409feb8edd5172':
          this.creditosUsuario.push(50);
          break;
        case '2786f4877b9091dcad7f35751bfcf5d5ea712b2f':
          this.creditosUsuario.push(100);
          break;
      }
     }).catch(err => {
         console.log('Error', err);
     });
     
    this.firecloud.nuevaCarga(this.user.email, this.creditosUsuario);
  }

  public limpiar() {
    
  }

  public salir() {
    this.fireAuth.logout();
    this.router.navigate(['/login']);
  }

}
