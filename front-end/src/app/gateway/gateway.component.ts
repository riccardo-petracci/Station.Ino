import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { AuthenticationService } from '../services/authentication.service';
import { Observable } from 'rxjs';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { BaseChartDirective, Color, Label } from 'ng2-charts';

@Component({
  selector: 'app-gateway',
  templateUrl: './gateway.component.html',
  styleUrls: ['./gateway.component.scss']
})
export class GatewayComponent implements OnInit {

  public chart: BaseChartDirective;
  device: Observable<any>;

  constructor(public db: AngularFireDatabase, authService: AuthenticationService) { }

  async ngOnInit() {
    var id = JSON.parse(localStorage.getItem('user')).uid;
    this.device = this.db.list('users/'+ id +'/device').valueChanges();

    this.deviceData(id).valueChanges().subscribe((resp: any) => {

      for (let key of Object.keys(resp)) {
        this.pieChartData[0].data.push((resp[key].Ram_tot-resp[key].Ram_used),resp[key].Ram_used)
        // this.pieChartData[1].data.push(resp[key].Ram_used)
        // this.pieChartData[2].data.push(resp[key].Ram_tot)

        this.pie2ChartData[0].data.push((resp[key].Disk_tot-resp[key].Disk_used),resp[key].Disk_used)
        // this.pie2ChartData[1].data.push(resp[key].Ram_tot)
        // let date = resp[key].date
        // this.chartLabels.push(date)
      }
      this.chart.chart.update()
    });
  }

  //pie chart

  pieChartData: ChartDataSets[] = [
    { data: [], label: 'RAM Free' },
  ];

  pieChartLabels: Label[] = ['Ram Free','Ram Used']

  pieChartOptions = {
    responsive: true,
  };

  pieChartColors: Color[] = [
    {
      borderColor: 'black',
      backgroundColor: [
        "#0080FF",
        "#84FF63"
      ],
    },
  ];

  pieChartLegend = true;
  pieChartPlugins = [];
  pieChartType = 'pie';

  pie2ChartData: ChartDataSets[] = [
    { data: [], label: 'DISK' },
  ];

  pie2ChartLabels: Label[] = ['Disk Free','Disk Used']

  pie2ChartOptions = {
    responsive: true,
  };

  pie2ChartColors: Color[] = [
    {
      borderColor: 'black',
      backgroundColor: [
        "#0080FF",
        "#84FF63"
      ]
    },
  ];

  pie2ChartLegend = true;
  pie2ChartPlugins = [];
  pie2ChartType = 'pie';

  deviceData(id) {
    return this.db.list('users/' + id + '/device');
  }

}
