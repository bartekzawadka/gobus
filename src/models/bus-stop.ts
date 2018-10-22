export class BusStop {
  name: string;
  id: number;
  number: string;
  lines: Array<number> = [];

  static getClone(busStop: BusStop) : BusStop{
    let copy = new BusStop();
    copy.lines = busStop.lines;
    copy.number = busStop.number;
    copy.id = busStop.id;
    copy.name = busStop.name;

    return copy;
  }
}
