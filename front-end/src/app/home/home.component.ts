import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { AuthenticationService } from '../services/authentication.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  title = 'Station.Ino';
  description = 'Smart Weather Station';

  realTime: Observable<any>;
  realTimeExt: Observable<any>;

  minTemp: Observable<any>;
  maxTemp: Observable<any>;

  minHum: Observable<any>;
  maxHum: Observable<any>;

  minExtTemp: Observable<any>;
  maxExtTemp: Observable<any>;

  minExtHum: Observable<any>;
  maxExtHum: Observable<any>;

  minExtLum: Observable<any>;
  maxExtLum: Observable<any>;

  constructor(public db: AngularFireDatabase, authService: AuthenticationService) { }

  ngOnInit(): void {
    var values = JSON.parse(localStorage.getItem('user')).uid;

    this.realTime = this.db.list('users/' + values + '/raspberryRTSensors').valueChanges();
    this.realTimeExt = this.db.list('users/' + values + '/raspberryRTSensorsExt').valueChanges();

    this.minTemp = this.db.list('users/' + values + '/raspberrySensors/storeData', ref => ref.orderByChild('temperature').limitToFirst(1)).valueChanges();
    this.maxTemp = this.db.list('users/' + values + '/raspberrySensors/storeData', ref => ref.orderByChild('temperature').limitToLast(1)).valueChanges();

    this.minHum = this.db.list('users/' + values + '/raspberrySensors/storeData', ref => ref.orderByChild('humidity').limitToFirst(1)).valueChanges();
    this.maxHum = this.db.list('users/' + values + '/raspberrySensors/storeData', ref => ref.orderByChild('humidity').limitToLast(1)).valueChanges();

    this.minExtHum = this.db.list('users/' + values + '/raspberrySensorsExt/storeData', ref => ref.orderByChild('extTemp').limitToFirst(1)).valueChanges();
    this.maxExtHum = this.db.list('users/' + values + '/raspberrySensorsExt/storeData', ref => ref.orderByChild('extTemp').limitToLast(1)).valueChanges();

    this.minExtTemp = this.db.list('users/' + values + '/raspberrySensorsExt/storeData', ref => ref.orderByChild('extHum').limitToFirst(1)).valueChanges();
    this.maxExtTemp = this.db.list('users/' + values + '/raspberrySensorsExt/storeData', ref => ref.orderByChild('extHum').limitToLast(1)).valueChanges();

    this.minExtLum = this.db.list('users/' + values + '/raspberrySensorsExt/storeData', ref => ref.orderByChild('luminosity').limitToFirst(1)).valueChanges();
    this.maxExtLum = this.db.list('users/' + values + '/raspberrySensorsExt/storeData', ref => ref.orderByChild('luminosity').limitToLast(1)).valueChanges();
  }

  changeGrey(value){
    if(value <= 150){
      document.getElementById('circle').style.filter = "grayscale(100%)";
    }
    if(value >150 && value <= 300){
      document.getElementById('circle').style.filter = "grayscale(70%)";
    }
    if(value >300 && value <= 600){
      document.getElementById('circle').style.filter = "grayscale(50%)";
    }
    if(value >600 && value <= 800){
      document.getElementById('circle').style.filter = "grayscale(30%)";
    }
    if(value > 800){
      document.getElementById('circle').style.filter = "grayscale(0%)";
    }
  }
}
