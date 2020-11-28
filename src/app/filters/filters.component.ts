import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Tests } from '../tests-data/tests-data'
import { HttpClient } from "@angular/common/http"
import { UserService } from '../services/user/user.service';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';


@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.css']
})
export class FiltersComponent implements OnInit {

  constructor(private http: HttpClient, private user: UserService, private router: Router) { }
  testsData: Tests[];
  template = `<div class="form-group" *ngFor="let filter of filtersArr; let i = index;">
  <div class="filter-sort-container" id=i>
    <div class="filter-container"> 
      <div>Filter by...</div>
      <input class="form-control" type="text" placeholder="Search any value..." ng-model="test">
      <select class="form-control" type="select" ng-model="test">
        <option *ngFor="let header of headers; let i = index;" [value] = headers[i]>{{header}}</option> 
      </select>
    <div id="buttons-filter">
        <button type="button" class="btn btn-primary" (click)="handleIncrement($event)">
            <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-plus-circle-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3v-3z"/>
            </svg>
        </button>
        <button type="button" class="btn btn-danger" (click)="handleDecrement($event)">
            <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-dash-circle-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM4.5 7.5a.5.5 0 0 0 0 1h7a.5.5 0 0 0 0-1h-7z"/>
            </svg>
        </button>
    </div>
    </div>
    <!-- <div class="sort-container">
      <input type="text" placeholder="Search any value..." ng-model="test">
    </div> -->
  </div>
</div>`;
  ngOnInit(): void {
    this.getDataFromServer();
  }
  getDataFromServer = () => {
    const promise = this.http.get<Tests[]>('http://localhost:3001/tests').toPromise();
    promise.then((tests) => {
      this.testsData = tests;
      this.renderHeaders();
    });
  }
  headers: String[] = [];
  renderHeaders = async () => {
    try {
      if (this.testsData.length > 0) {
        const tempHeaders = Object.values(this.testsData).map((obj, objectIndex, arr) => {
          return Object.keys(obj).map(keys => {
            if (keys === "__v" || keys === "_id" || keys === "fullReport")
              return '';
            else
              switch (keys) {
                case "id":
                  return "Test ID"
                case "date":
                  return "Test Date and Time"
                case "name":
                  return "Test Name"
                case "status":
                  return "Test Status"
                case "duration":
                  return "Test Duration"
                case "click":
                  return "Click test"
                case "custom":
                  return "Custom test"
                case "eql":
                  return "Equal To"
                case "typeText":
                  return "Type text Test"
                case "navigateTo":
                  return "Navigation Test"
                case "expect":
                  return "Expected"
                default:
                  return '';
              }
          });
        });
        if (this.headers.length <= tempHeaders.length) {
          for (var i = 0; i < tempHeaders[0].length; i++) {
            if (tempHeaders[0][i] !== "")
              this.headers.push(tempHeaders[0][i]);;
          }
        }
      }
    }
    catch (err) {
      console.log(err);
    }
  }



  //Handle filtering and sorting
  filtersArr = [{ component: this.template, id: 0 }]
  handleIncrement = (event: any) => {
    console.log(event);
    this.filtersArr.push({ component: this.template, id: this.filtersArr.length });
  }

  handleDecrement = (event: any) => {
    let filter = event.path.find((value, index) => value.className == "filter-sort-container");
    let filterId = parseInt(filter.id);
    this.filtersArr = this.filtersArr.filter(component => {
      if (component.id !== filterId)
        return component;
    });
  }
  //Pass filter data to parent componenet
  filterData = {};
  @Input('childToMaster') masterName: string;
  @Output() childToParent = new EventEmitter<any>();

  sendToParent() {
    this.childToParent.emit(this.filterData);
  }

  getKeyPerFilterParam = (key) => {

  }
  onKeyPress = (event) => {
    this.filterData = {};
    var valuesElementsArr = document.querySelectorAll<HTMLInputElement>('input.input-filter');
    var keysElementsArr = document.querySelectorAll<HTMLInputElement>('select.select-filter');
    var valuesArr = [];
    var objectKeysArr = [];

    for (var i = 0; i < valuesElementsArr.length; i++) {
      valuesArr.push(valuesElementsArr[i].value);
    }
    for (var i = 0; i < keysElementsArr.length; i++) {
      if (keysElementsArr[i].value == "Test ID")
        objectKeysArr.push("id");
      if (keysElementsArr[i].value == "Test Date and Time")
        objectKeysArr.push("date");
      if (keysElementsArr[i].value == "Test Status")
        objectKeysArr.push("status");
      if (keysElementsArr[i].value == "Test Name")
        objectKeysArr.push("name");
      if (keysElementsArr[i].value == "Test Duration")
        objectKeysArr.push("duration");
    }

    for (var i = 0; i < this.filtersArr.length; i++) {
      if (valuesArr[i] == "") {
        console.log("This value is empty mate.. Breaking the loop");
        break;
      }
      this.filterData[objectKeysArr[i]] = valuesArr[i];
    }

    console.log(this.filterData);
    this.sendToParent();
  }
}
