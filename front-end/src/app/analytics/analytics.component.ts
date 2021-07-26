import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { AuthenticationService } from '../services/authentication.service';
import { Observable } from 'rxjs';
import { Chart, ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { BaseChartDirective, Color, Label } from 'ng2-charts';

@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.scss']
})
export class AnalyticsComponent implements OnInit {

  constructor(public db: AngularFireDatabase, authService: AuthenticationService) { }

  public chart: BaseChartDirective;

  chartOptions = {
    responsive: true,
    legend: {
      display: true
    },
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero: false
        }
      }]
    },
  };

  chartOptions2 = {
    responsive: true,
    legend: {
      display: true
    },
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero: true
        }
      }]
    },
  };

  chartData = [
    { data: [], label: 'Internal Temperature' },
    { data: [], label: 'External Temperature' }
  ];

  chartData2 = [
    { data: [], label: 'Internal Humidity' },
    { data: [], label: 'External Humidity' }
  ];

  chartData3 = [
    { data: [], label: 'Luminosity' },
  ];

  chartData4 = [
    { data: [], label: 'Max Temperature' },
    { data: [], label: 'Max Humidity' },
    { data: [], label: 'Max Temperature External' },
    { data: [], label: 'Max Humidity External' },
  ];

  chartData5 = [
    { data: [], label: 'Min Temperature' },
    { data: [], label: 'Min Humidity' },
    { data: [], label: 'Min Temperature External' },
    { data: [], label: 'Min Humidity External' },
  ];

  colors = [];
  chartLabels = [];
  chartLabels1 = ['Minimum Data'];
  chartLabels2 = ['Maximum Data'];

  async ngOnInit() {
    var id = JSON.parse(localStorage.getItem('user')).uid;

    this.internalData(id).valueChanges().subscribe((resp: any) => {
      for (let key of Object.keys(resp)) {
        this.chartData[0].data.push(resp[key].temperature)
        this.chartData2[0].data.push(resp[key].humidity)
        let date = resp[key].date
        this.chartLabels.push(date)
      }
      this.chart.chart.update()
    });


    this.externalData(id).valueChanges().subscribe((resp: any) => {
      for (let key of Object.keys(resp)) {
        this.chartData[1].data.push(resp[key].extTemp)
        this.chartData2[1].data.push(resp[key].extHum)
        this.chartData3[0].data.push(resp[key].luminosity)
      }
      this.chart.chart.update()
    });


    this.internalDataTempMax(id).valueChanges().subscribe((resp: any) => {
      for (let key of Object.keys(resp)) {
        this.chartData4[0].data.push(resp[key].temperature)
      }
      this.chart.chart.update()
    });


    this.internalDataTempMin(id).valueChanges().subscribe((resp: any) => {
      for (let key of Object.keys(resp)) {
        this.chartData5[0].data.push(resp[key].temperature)
      }
      this.chart.chart.update()
    });


    this.internalDataHumMax(id).valueChanges().subscribe((resp: any) => {
      for (let key of Object.keys(resp)) {
        this.chartData4[1].data.push(resp[key].humidity)
      }
      this.chart.chart.update()
    });


    this.internalDataHumMin(id).valueChanges().subscribe((resp: any) => {
      for (let key of Object.keys(resp)) {
        this.chartData5[1].data.push(resp[key].humidity)
      }
      this.chart.chart.update()
    });


    this.externalDataTempMax(id).valueChanges().subscribe((resp: any) => {
      for (let key of Object.keys(resp)) {
        this.chartData4[2].data.push(resp[key].extTemp)
      }
      this.chart.chart.update()
    });


    this.externalDataHumMax(id).valueChanges().subscribe((resp: any) => {
      for (let key of Object.keys(resp)) {
        this.chartData4[3].data.push(resp[key].extHum)
      }
      this.chart.chart.update()
    });


    this.externalDataTempMin(id).valueChanges().subscribe((resp: any) => {
      for (let key of Object.keys(resp)) {
        this.chartData5[2].data.push(resp[key].extTemp)
      }
      this.chart.chart.update()
    });


    this.externalDataHumMin(id).valueChanges().subscribe((resp: any) => {
      for (let key of Object.keys(resp)) {
        this.chartData5[3].data.push(resp[key].extHum)
      }
      this.chart.chart.update()
    });
  }

  //general data
  internalData(id: string) {
    return this.db.list('users/' + id + '/raspberrySensors/storeData');
  }

  externalData(id: string) {
    return this.db.list('users/' + id + '/raspberrySensorsExt/storeData');
  }

  //specific data
  internalDataTempMax(id: string) {
    return this.db.list('users/' + id + '/raspberrySensors/storeData', ref => ref.orderByChild('temperature').limitToLast(1));
  }

  internalDataTempMin(id: string) {
    return this.db.list('users/' + id + '/raspberrySensors/storeData', ref => ref.orderByChild('temperature').limitToFirst(1));
  }

  internalDataHumMax(id: string) {
    return this.db.list('users/' + id + '/raspberrySensors/storeData', ref => ref.orderByChild('humidity').limitToLast(1));
  }

  internalDataHumMin(id: string) {
    return this.db.list('users/' + id + '/raspberrySensors/storeData', ref => ref.orderByChild('humidity').limitToFirst(1));
  }

  externalDataTempMax(id: string) {
    return this.db.list('users/' + id + '/raspberrySensorsExt/storeData', ref => ref.orderByChild('extTemp').limitToLast(1));
  }

  externalDataTempMin(id: string) {
    return this.db.list('users/' + id + '/raspberrySensorsExt/storeData', ref => ref.orderByChild('extTemp').limitToFirst(1));
  }

  externalDataHumMax(id: string) {
    return this.db.list('users/' + id + '/raspberrySensorsExt/storeData', ref => ref.orderByChild('extHum').limitToLast(1));
  }

  externalDataHumMin(id: string) {
    return this.db.list('users/' + id + '/raspberrySensorsExt/storeData', ref => ref.orderByChild('extHum').limitToFirst(1));
  }

  // updateChart() {
  //   //window.location.reload()
  //   let ctx,config:any
  //   this.chart.chart = new Chart(ctx,config)
  //   this.chart.chart.update()
  // }

}
