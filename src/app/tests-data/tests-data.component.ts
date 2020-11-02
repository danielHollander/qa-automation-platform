import { Component, OnInit } from '@angular/core';
import { Tests } from '../tests-data/tests-data'
import { HttpClient } from "@angular/common/http"
import { Observable, Subscription } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

@Component({
  selector: 'app-tests-data',
  templateUrl: './tests-data.component.html',
  styleUrls: ['./tests-data.component.css']
})
export class TestsDataComponent implements OnInit {
  constructor(private http: HttpClient) { }
  testsData: Tests[];


  getDataFromServer = () => {
    const promise = this.http.get<Tests[]>('http://localhost:3001/tests').toPromise();
    promise.then((tests) => {
      this.testsData = tests;
      this.renderHeaders();
      this.renderValuesData();
    });
  }

  headers: String[] = [];
  renderHeaders = async () => {
    try {
      if (this.testsData.length > 0) {
        const tempHeaders = Object.values(this.testsData).map((obj, objectIndex, arr) => {
          return Object.keys(obj).map(keys => keys !== "__v" && keys !== "_id" ? keys : '');
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

  values = [];
  renderValuesData = () => {
    this.values = Object.values(this.testsData).map((object, objectIndex, array) => {
      const allowed = [
        "id",
        "name",
        "date",
        "click",
        "navigateTo",
        "expect",
        "eql",
        "typeText",
        "getBrowserConsoleMessages",
        "custom",
        "status",
        "duration"
      ];
      const filtered = Object.keys(object)
        .filter(key => allowed.includes(key))
        .reduce((obj, key) => {
          return {
            ...obj,
            [key]: object[key]
          };
        }, {});
      return Object.values(filtered).map((property, index, arr) => typeof property != "undefined" ? property.toString() : '');
    })

    console.log(this.values);
  }

  addIconClass = (cellValue) => {
    console.log(cellValue);
  }

  updateData;

  async ngOnInit() {
    this.getDataFromServer();
    //See if we can run this only on click and clear it after
    //Is running it with observable is a better approach? 
    //Clear the interval?
    // this.updateData = setInterval(() => {
    //   const promise = this.http.get<Tests[]>('http://localhost:3001/tests').toPromise();
    //   promise.then((tests) => {
    //     console.log("calling interval");
    //     this.testsData = tests;
    //     this.renderValuesData();
    //   });
    // }, 30000);
  }

  ngDoCheck() {
    console.log(this.testsData);
  }
}
