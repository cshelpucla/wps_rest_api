import { Moment } from "moment";

const moment = require("moment");

export class DateHelper {
    sameDates(date1, date2) : boolean{
        let moment1 = moment(date1);
        let moment2 = moment(date2);
        return moment1.isSame(moment2, 'day');
    }

    inRange(startDate, endDate, now=moment()) : boolean {
        const startMoment = moment(startDate);
        const endMoment = moment(endDate);

        if (now != null) {
            now = moment(now);
        }
        
        if (startMoment <= now && now <= endMoment){
          return true;
        }

        return false;
    }

    hasPassed(startDate, endDate, now=moment()) : boolean {
        const startMoment = moment(startDate);
        const endMoment = moment(endDate);

        if (now != null) {
            now = moment(now);
        }
        
        if (now >= endMoment){
          return true;
        }

        return false;
    }

    now() {
        return moment();
    }

    moment(date) {
        return moment(date);
    }

    toUnix(date : Moment) {
        return date.unix();
    }
}; 