import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { AngularFireDatabase } from '@angular/fire/database';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  constructor(public authService: AuthenticationService, public db: AngularFireDatabase) { }

  ngOnInit(): void {
    var values = JSON.parse(localStorage.getItem('user')).uid;
    //console.log("values uid: "+JSON.stringify(values))
    const data = this.db.list('pairing')
    data.set('uid', values)
  }

}
