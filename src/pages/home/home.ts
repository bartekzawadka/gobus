import {Component} from '@angular/core';
import {NavController, Toast, ToastController} from 'ionic-angular';
import {TimetableProvider} from "../../providers/timetable/timetable";
import {ConfigProvider} from "../../providers/config/config";
import {Settings} from "../../models/settings";
import {BusStop} from "../../models/bus-stop";
import * as _ from 'lodash';
import * as moment from 'moment';
import {BusSchedule} from "../../models/bus-schedule";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  private errorToast: Toast;
  private isErrorToastVisible = false;
  busStop = BusStop.fromSettings(new Settings());
  busList : Array<BusSchedule> = [];
  actualTime = moment();

  constructor(
    public navCtrl: NavController,
    public timetableProvider: TimetableProvider,
    public configProvider: ConfigProvider,
    public toastCtrl: ToastController) {

    this.errorToast = this.toastCtrl.create({
      position: 'top',
      dismissOnPageChange: true
    });
  }

  ionViewDidEnter() {
    this.configProvider.getSettings().then(settings => {
      let clean = false;
      if(settings.busStopId !== this.busStop.id
        || settings.busStopNr !== this.busStop.number){
        clean = true;
      }

      this.busStop = BusStop.fromSettings(settings);
      this.loadData(clean);
      this.runTimer();
    });
  }

  private loadData(cleanExistingData = false) {
    if(cleanExistingData) {
      this.busList = [];
    }

    this.timetableProvider
      .getBusLinesForBusStop(this.busStop)
      .then(result => {
        this.busStop = result;
        this.presentSchedule();
      }).catch()
  }

  private presentSchedule() {
    let handler = setTimeout(
      () => this.onPresentationTick(handler),
      ConfigProvider.getSysConfig().dataRefreshInterval);
  }

  private onPresentationTick(handler: number) {
    clearTimeout(handler);

    let promises: Array<Promise<any>> = [];

    _.forEach(this.busStop.lines, (item) => {
      promises.push(
        this.timetableProvider.getBusSchedule(
          this.busStop.id,
          this.busStop.number,
          item));
    });

    let me = this;

    Promise.all(promises)
      .then(results => {
        me.handleError().then(() => {
          me.handleResults(results);
          me.presentSchedule();
        });
      })
      .catch(e => {
        me.handleError(e)
          .then(me.presentSchedule)
          .catch(me.presentSchedule);
      });
  }

  private handleResults(data: any[]) {
    let schedule: Array<BusSchedule> = _.flatten(data);

    const dateFormat = "DD-MM-YYYY";
    const dateTimeFormat = dateFormat + " HH:mm:ss";

    let smallerSchedule: Array<BusSchedule> = [];
    let currentTime = moment();
    let currentDateText = currentTime.format(dateFormat);

    _.forEach(schedule, (item) => {
      let time = moment(currentDateText + " " + item.eta, dateTimeFormat);
      if (time > currentTime) {
        item.time = time;
        item.remaining = moment.duration(time.diff(currentTime));
        let minutes = item.remaining.asMinutes();
        if(minutes <= 5){
          item.isCommingSoon = true;
        }
        smallerSchedule.push(item);
      }
    });

    let sortedSchedules = _.orderBy(smallerSchedule, [i => i.time]);

    let numberOfResults = ConfigProvider.getSysConfig().numberOfResults;
    if (!numberOfResults) {
      numberOfResults = 10;
    }

    this.busList = _.take(sortedSchedules, numberOfResults);
  }

  private handleError(e?): Promise<any> {
    return new Promise((resolve, reject) => {
      if (e) {
        this.errorToast.setMessage(e);
        if (!this.isErrorToastVisible) {
          this.errorToast.present()
            .then(() => {
              this.isErrorToastVisible = true;
              resolve();
            })
            .catch(reject);
        } else {
          this.isErrorToastVisible = true;
          resolve();
        }
      } else {
        if (this.isErrorToastVisible) {
          this.errorToast.dismiss()
            .then(() => {
              this.isErrorToastVisible = false;
              resolve();
            })
            .catch(reject);
        } else {
          this.isErrorToastVisible = false;
          resolve();
        }
      }
    });
  }

  private runTimer(){
    setInterval(()=>{
      this.actualTime = moment();
    }, 1000);
  }
}
