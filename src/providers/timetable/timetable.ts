import {HttpClient, HttpParams} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {BusStop} from "../../models/bus-stop";
import {ConfigProvider} from "../config/config";
import {BusSchedule} from "../../models/bus-schedule";

/*
  Generated class for the TimetableProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class TimetableProvider {

  private config: any;

  constructor(public http: HttpClient) {
    this.config = ConfigProvider.getSysConfig();
  }

  getBusSchedule(busStopId: number, busStopNumber: string, line: string): Promise<Array<BusSchedule>> {
    const sourceId = "e923fa0e-d96c-43f9-ae6e-60518c9f3238";

    let onDataReceived = (data: any): Array<BusSchedule> => {
      let schedules: Array<BusSchedule> = [];

      for (let k in data.result) {
        if (!data.result.hasOwnProperty(k)) {
          continue;
        }

        let item = new BusSchedule();

        for (let i in data.result[k].values) {
          if (!data.result[k].values.hasOwnProperty(i)) {
            continue;
          }

          if (data.result[k].values[i].key === 'kierunek') {
            item.direction = data.result[k].values[i].value;
          }
          if (data.result[k].values[i].key === 'czas') {
            item.eta = data.result[k].values[i].value;
          }
        }

        if (item.direction && item.eta) {
          item.line = line;
          schedules.push(item);
        }
      }

      return schedules;
    };

    return this.call(sourceId, [{
      key: "busstopId",
      value: busStopId
    }, {
      key: "busstopNr",
      value: busStopNumber
    }, {
      key: "line",
      value: line
    }], onDataReceived);
  }

  getBusLinesForBusStop(busStop: BusStop): Promise<BusStop> {
    const sourceId = "88cd555f-6f31-43ca-9de4-66c479ad5942";

    let onDataReceived = (data: any): BusStop => {
      let lines = [];

      for (let k in data.result) {
        if (!data.result.hasOwnProperty(k)) {
          continue;
        }

        for (let i in data.result[k].values) {
          if (!data.result[k].values.hasOwnProperty(i)) {
            return;
          }

          if (data.result[k].values[i].key === 'linia') {
            lines.push(data.result[k].values[i].value);
          }
        }
      }

      busStop.lines = lines;
      return busStop;
    };

    return this.call(sourceId, [{
      key: "busstopId",
      value: busStop.id
    }, {
      key: "busstopNr",
      value: busStop.number
    }], onDataReceived);
  }

  getBusStopByName(name: string): Promise<Array<BusStop>> {
    const sourceId = "b27f4c17-5c50-4a5b-89dd-236b282bc499";

    let onDataReceived = (data: any): Array<BusStop> => {
      let result = [];

      for (let k in data.result) {
        if (data.result.hasOwnProperty(k)) {
          if (!data.result[k].values) {
            continue;
          }

          let item = new BusStop();
          for (let i in data.result[k].values) {
            if (data.result[k].values.hasOwnProperty(i)) {
              if (data.result[k].values[i].key == "nazwa") {
                item.name = data.result[k].values[i].value;
              }
              if (data.result[k].values[i].key == "zespol") {
                item.id = data.result[k].values[i].value;
              }
            }
          }

          if (!item.id || !item.name) {
            continue;
          }

          result.push(item);
        }
      }

      return result;
    };

    return this.call(sourceId, [
      {
        key: "name",
        value: name
      }
    ], onDataReceived);
  }

  private call<T>(
    sourceId: string,
    params: [{ key: string, value: any }],
    onDataReceived: (data: any) => T) {
    return new Promise<T>((resolve, reject) => {
      let parameters = {
        "id": sourceId,
        "apikey": this.config.api.key
      };

      for (let k in params) {
        parameters[params[k].key] = params[k].value;
      }

      return this.http.get(this.config.api.endpoint, {
        params: new HttpParams({
          fromObject: parameters
        })
      }).subscribe(results => {
        let error = TimetableProvider.getErrorMessage(results);
        if (error) {
          reject(error);
          return;
        }

        resolve(onDataReceived(results));
      }, reject);
    })
  }

  private static getErrorMessage(data: any): string {
    if (!data || !data.result || data.result.length === 0) {
      return;
    }

    if (data.result === 'false' && data.error) {
      return data.error;
    }
  }
}
