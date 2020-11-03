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
                case "click":
                  return "Click Parameter"
                case "navigateTo":
                  return "Navigation Parameter"
                case "expect":
                  return "Expected Test Result Parameter"
                case "eql":
                  return "Expected Test Result will Equall to Parameter"
                case "typeText":
                  return "Typed Text Parameter"
                case "getBrowserConsoleMessages":
                  return "Browser Console Message Parameter"
                case "custom":
                  return "Custom Test"
                case "status":
                  return "Test Status"
                case "duration":
                  return "Test Duration"
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
    this.updateData = setInterval(() => {
      const promise = this.http.get<Tests[]>('http://localhost:3001/tests').toPromise();
      promise.then((tests) => {
        console.log("calling interval");
        this.testsData = tests;
        this.renderValuesData();
      });
    }, 30000);
  }


  //Handle popup status for full report
  popup = false;
  testFullReport = '';
  getFullTestLog = (event) => {
    console.log(event);
    this.popup = true;
    console.log(this.testsData);
    for (var i = 0; i < this.testsData.length; i++) {
      if (event.target.parentElement.parentElement.children[0].innerText == this.testsData[i].id[0]) {
        this.testFullReport = this.testsData[i].fullReport[0];
        return;
      }
      if (i == this.testsData.length - 1)
        console.error("No reports were found which is weird...check database values");
    }
  }

  ngAfterViewChecked() {
    const nonClickableElementsArray = document.querySelectorAll('.text-success, .text-danger');
    for (var i = 0; i < nonClickableElementsArray.length; i++) {
      nonClickableElementsArray[i].addEventListener("click", this.getFullTestLog);
    };
  }
}
