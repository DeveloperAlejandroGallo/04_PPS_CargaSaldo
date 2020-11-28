import { Component } from '@angular/core';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { NativeAudio } from '@ionic-native/native-audio/ngx';
// back button
import { Platform } from '@ionic/angular';
import { Plugins } from '@capacitor/core';

const { App } = Plugins;



@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private nativeAudio: NativeAudio
  ) {
    this.initializeApp();
  }
 
  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.statusBar.overlaysWebView(false);
      this.setAndroidBackButtonBehavior(); // inicializa el observable

      this.nativeAudio.preloadSimple('splashAudio','assets/sound/splash.mp3').then(onSuccess=>{

        this.nativeAudio.play('splashAudio').then(onSuccess=>{
          console.log( 'Reproduciendo: splashAudio');
        }, onError=>{
          console.error('Fallo al reproducir splashAudio error: ' + onError);
        });
      }, onError=>{
        console.error('Fallo al cargar splashAudio - error: '+ onError);
      });

    });
  }
  // Evita la vuelta atrás.
  private setAndroidBackButtonBehavior(): void {
    this.platform.backButton.subscribe(() => {
      // tslint:disable-next-line: triple-equals
      if (window.location.pathname == '/login') {
        // tslint:disable-next-line: no-string-literal
        navigator['app'].exitApp();
      }
    });
  }

}
