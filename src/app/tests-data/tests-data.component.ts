import { Component, OnInit } from '@angular/core';
import { Tests } from '../tests-data/tests-data'
import { HttpClient } from "@angular/common/http"

@Component({
  selector: 'app-tests-data',
  templateUrl: './tests-data.component.html',
  styleUrls: ['./tests-data.component.css']
})
export class TestsDataComponent implements OnInit {
  constructor(private http: HttpClient) { }
  testsData: Tests[];

  private getDataFromServer = () => {
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
  }
  async ngOnInit() {
    this.getDataFromServer();
  }


}
