import { Injectable } from '@angular/core';
 
@Injectable()
export class CalculationsService {

  constructor() {}
  
  getDaysFromJ2000(year: number, month: number, day: number, hours: number, minutes: number): number {

    let daysFromJ2000: number = 0;

    const daysToBeginningOfMonth: Array<any> = [ [1, 0, 0], [2, 31, 31], [3, 59, 60], [4, 90, 91], [5, 120, 121], [6, 151, 152], [7, 181, 182], [8, 212, 213], [9, 243, 244], [10, 273, 274], [11, 304, 305], [12, 334, 335] ];
    const daysSinceJ2000ToBeginningOfYear: Array<any> = [ [1998, -731.5], [1999, -366.5], [2000, -1.5], [2001, 364.5], [2002, 729.5], [2003, 1094.5], [2004, 1459.5], [2005, 1825.5], [2006, 2190.5], [2007, 2555.5], [2008, 2920.5], [2009, 3286.5], [2010, 3651.5], [2011, 4016.5], [2012, 4381.5], [2013, 4747.5], [2014, 5112.5], [2015, 5477.5], [2016, 5842.5], [2017, 6208.5], [2018, 6573.5], [2019, 6938.5], [2020, 7303.5], [2021, 7669.5] ];

    // Calculate fraction of the day
    let fractionOfDay: number = (hours + minutes / 60) / 24;

    // Find number of days to the beginning of month
    let numberOfDaysToBeginningOfMonth: number = 0;

    daysToBeginningOfMonth.forEach(element => {
        if (element[0] === month) {
            if (this.isLeapYear(year)) {
                numberOfDaysToBeginningOfMonth = element[2];
            } else {
                numberOfDaysToBeginningOfMonth = element[1];
            }
        }
    })

    // Find days since J2000.0 to the beginning of the year
    let numberOfDaysSinceJ2000ToBeginningOfYear: number = 0;

    daysSinceJ2000ToBeginningOfYear.forEach(element => {
        if (element[0] === year) {
            numberOfDaysSinceJ2000ToBeginningOfYear = element[1];
        }
    })

    // Add these calculations to get daysFromJ2000
    daysFromJ2000 = fractionOfDay + numberOfDaysToBeginningOfMonth + day + numberOfDaysSinceJ2000ToBeginningOfYear;

    return daysFromJ2000;

  }

  getLocalSiderialTime(year: number, month: number, day: number, hours: number, minutes: number, LON: number): number {

    let localSiderialTime: number = 0;

    // Calculate fraction of the day
    let UT: number = (hours + minutes / 60);

    // Calculate days from J2000
    let daysFromJ2000: number = this.getDaysFromJ2000(year, month, day, hours, minutes);

    // Calculate local siderial time, add 360 if negative
    localSiderialTime = (100.46 + 0.985647 * daysFromJ2000 + LON + 15 * UT) < 0 ? ((100.46 + 0.985647 * daysFromJ2000 + LON + 15 * UT) + 360) : (100.46 + 0.985647 * daysFromJ2000 + LON + 15 * UT);

    return localSiderialTime;

  }

  getHourAngle(localSiderialTime: number, RA: number): number {
    return (localSiderialTime - RA) < 0 ? localSiderialTime - RA + 360 : localSiderialTime - RA;
  }

  getAltAz(RA: number, DEC: number, LAT: number, LON: number, year: number, month: number, day: number, hours: number, minutes: number): Array<number> {

      // RA - hours decimal
      // DEC, LAT, LON - degrees decimal
      // Result - degrees decimal (array of two numbers, altitude and azimuth)

      let AltAz: Array<number> = [];

      let HA: number = this.getHourAngle(this.getLocalSiderialTime(year, month, day, hours, minutes, LON), this.convertRAToDegreesDecimal(RA));

      let sinDEC = Math.sin(this.convertDegreesToRadians(DEC));
      let sinLAT = Math.sin(this.convertDegreesToRadians(LAT));
      let sinHA = Math.sin(this.convertDegreesToRadians(HA));
      let cosDEC = Math.cos(this.convertDegreesToRadians(DEC));
      let cosLAT = Math.cos(this.convertDegreesToRadians(LAT));
      let cosHA = Math.cos(this.convertDegreesToRadians(HA));

      let sinALT = sinDEC * sinLAT + cosDEC * cosLAT * cosHA;
      let ALT = this.convertRadiansToDegrees(Math.asin(sinALT));
      
      let cosALT = Math.cos(this.convertDegreesToRadians(ALT));
      let cosA = (sinDEC - sinALT * sinLAT) / (cosALT * cosLAT);
      let A = this.convertRadiansToDegrees(Math.acos(cosA));

      let AZ = (sinHA > 0 ? 360 - A : A);

      AltAz = [ALT, AZ];

      return AltAz;
  }

  isLeapYear(year: number): boolean {
    return (year % 400) ? ((year % 100) ? ((year % 4) ? false : true) : false) : true;
  }

  convertToHours(hours: number, minutes: number, seconds: number): number {
    return hours + minutes/60 + seconds/3600;
  }

  convertToDegreesDecimal(degrees: number, minutes: number, seconds: number): number {
    return degrees < 0 ? -(Math.abs(degrees) + minutes/60 + seconds/3600) : degrees + minutes/60 + seconds/3600;
  }

  convertRAToDegreesDecimal (RA: number): number {
      return RA * 15;
  }

  convertDegreesToRadians(degrees: number): number {
      return degrees * Math.PI / 180;
  }

  convertRadiansToDegrees(radians: number): number {
      return radians / (Math.PI / 180);
  }

  convertDegreesDecimalToDegreesMinutesSeconds(degrees: number): Array<number> {

      let deg = parseInt(degrees.toString());
      let fraction = Math.abs(degrees - deg);
      let min = parseInt((fraction * 60).toString());
      let sec = Math.round(fraction * 3600 - min * 60);

      return [deg, min, sec];
  }

}