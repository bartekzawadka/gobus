import {Component} from '@angular/core';
import {LoadingController, NavController} from 'ionic-angular';
import {ErrorDialogProvider} from "../../providers/error-dialog/error-dialog";
import {TimetableProvider} from "../../providers/timetable/timetable";
import {BusStop} from "../../models/bus-stop";
import {ChooseBusStopNumberPage} from "../choose-bus-stop-number/choose-bus-stop-number";

/**
 * Generated class for the SearchBusStopPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-search-bus-stop',
  templateUrl: 'search-bus-stop.html',
})
export class SearchBusStopPage {
  busStopName: string;
  busStops: Array<BusStop> = [];
  autocomplete = "on";

  constructor(
    public navCtrl: NavController,
    public timetableSrv: TimetableProvider,
    public errorDialogSrv: ErrorDialogProvider,
    public loaderCtrl: LoadingController) {
  }

  search() {
    if(!this.busStopName || this.busStopName === ''){
      return;
    }

    let loader = this.loaderCtrl.create();
    loader.present().then(() => {
      this.timetableSrv.getBusStopByName(this.busStopName).then(data => {
        loader.dismiss().then(() => {
          this.busStops = data;
        });
      }).catch(e => {
        loader.dismiss().then(() => {
          this.errorDialogSrv.showError(e);
        });
      })
    }, e => {
      loader.dismiss().then(() => {
        this.errorDialogSrv.showError(e);
      });
    })
  }

  chooseBusNumber(item: BusStop){
    this.navCtrl.push(ChooseBusStopNumberPage, {
      busStopId: item.id,
      busStopName: item.name
    });
  }
}
