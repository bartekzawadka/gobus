import {ENV} from "@app/env"
import { Injectable } from '@angular/core';
import {Settings} from "../../models/settings";
import {Storage} from "@ionic/storage";

/*
  Generated class for the ConfigProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ConfigProvider {

  constructor(private storage: Storage) {
  }

  static getSysConfig(){
    return ENV;
  }

  getSettings() : Promise<Settings>{
    let settings = new Settings();

    return new Promise<Settings>((resolve, reject) => {
      Promise.all([
        this.storage.get('busStopId'),
        this.storage.get('busStopNr'),
        this.storage.get('busStopName'),
      ]).then(value => {
        try{
          if(value[0]) {
            settings.busStopId = value[0];
            settings.busStopNr = value[1];
            settings.busStopName = value[2];
          }
          resolve(settings);
        }catch (e) {
          reject(e);
        }
      }).catch(reason => reject(reason));
    });
  }

  saveSettings(settings: Settings){
    return new Promise((resolve, reject) => {
      Promise.all([
        this.storage.set('busStopId', settings.busStopId),
        this.storage.set('busStopNr', settings.busStopNr),
        this.storage.set('busStopName', settings.busStopName),
      ]).then(resolve)
        .catch(reject);
    });
  }
}
