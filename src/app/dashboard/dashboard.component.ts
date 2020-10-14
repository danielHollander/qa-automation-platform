import { Component, OnInit, HostBinding } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  @HostBinding('className') componentClass: string;

  constructor() {
    this.componentClass = 'col-md-9 ml-sm-auto col-lg-10 px-md-4';
  }


  ngOnInit() {

  }

}
