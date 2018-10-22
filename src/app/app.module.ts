import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { ConfigProvider } from '../providers/config/config';
import { TimetableProvider } from '../providers/timetable/timetable';
import { HttpClientModule} from "@angular/common/http";
import { ErrorDialogProvider } from '../providers/error-dialog/error-dialog';
import {SearchBusStopPage} from "../pages/search-bus-stop/search-bus-stop";
import {ChooseBusStopNumberPage} from "../pages/choose-bus-stop-number/choose-bus-stop-number";
import {IonicStorageModule} from "@ionic/storage";

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ListPage,
    SearchBusStopPage,
    ChooseBusStopNumberPage,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp, {
      mode: 'ios'
    }),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ListPage,
    SearchBusStopPage,
    ChooseBusStopNumberPage,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    ConfigProvider,
    TimetableProvider,
    ErrorDialogProvider
  ]
})
export class AppModule {}
