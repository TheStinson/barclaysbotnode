import {Component, OnInit} from '@angular/core';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import axios from 'axios';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  accounts = [];
  constructor(){

  }

  ngOnInit() {
    this.refreshList();
  }

  refreshList (){
    var self = this;
    self.accounts = [];
    axios.get('/account/all')
      .then(function (response) {
        self.accounts = response.data;
      }).catch(function (error) {
      console.log(error);
    });
  }

  generateOffers(){
    var self = this;
    axios.get('/generateoffer')
      .then(function (response) {
        setTimeout(function(){
          self.refreshList();
        },1000);
      }).catch(function (error){
      console.log(error);
    });
  }

  clearOffers(){
    var self = this;
    axios.get('/clearoffer')
      .then(function (response) {
        setTimeout(function(){
          self.refreshList();
        },1000);
      }).catch(function (error) {
      console.log(error);
    });
  }

}
