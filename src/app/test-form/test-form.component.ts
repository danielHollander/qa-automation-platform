import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpClient } from "@angular/common/http"
import { Tests } from '../tests-data/tests-data'
import { TestsDataComponent } from '../tests-data/tests-data.component'

@Component({
  selector: 'app-test-form',
  templateUrl: './test-form.component.html',
  styleUrls: ['./test-form.component.css']
})
export class TestFormComponent implements OnInit {
  postId: any;
  errorMessage: any;

  constructor(private http: HttpClient) { }
  testsData: TestsDataComponent["testsData"];

  testName = '';
  name = new FormControl({ name: this.testName });

  componentsArr = [{ component: '<app-form></app-form>', id: 0 }];

  sendToChild() {
    return this.componentsArr;
  }
  childToParent(arr) {
    this.componentsArr = arr;
  }

  getDataFromServer = () => {
    const promise = this.http.get<Tests[]>('http://localhost:3001/tests').toPromise();
    promise.then((tests) => {
      this.testsData = tests;
      this.renderValuesData();
    });
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
        "status"
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

  handeReset() {
    window.location.reload();
  }

  ngOnInit(): void {
    this.getDataFromServer();
  }

  ngDoCheck() {
    this.sendToChild()
  }

  onUpdateTestName(event: Event) {
    this.testName = (<HTMLInputElement>event.target).value;
  }

  onSubmit = (event: any) => {
    console.log(this.testsData);
    let tempData = (event: any) => {

      let dataObject = {};
      dataObject["name"] = event.currentTarget[0].value;
      for (var i = 0; i < event.currentTarget.length; i++) {
        if (event.currentTarget[i].type == "select-one" && event.currentTarget[i].value != "custom" && event.currentTarget[i].value != "multipleTests" && event.currentTarget[i].value != "multipleTests") {
          if (typeof dataObject[event.currentTarget[i].value] == "undefined") {
            dataObject[event.currentTarget[i].value] = [];
            dataObject[event.currentTarget[i].value].push(event.currentTarget[i + 1].value);
          } else
            dataObject[event.currentTarget[i].value].push(event.currentTarget[i + 1].value);
        }
        //Handle custom test script and make sure the input will be a one liner
        if (event.currentTarget[i].classList.value == "ace_text-input" && event.currentTarget[i].parentElement.hidden == false) {
          dataObject[event.currentTarget[i - 1].id] = dataObject[event.currentTarget[i - 1].id] || [];
          var str = event.currentTarget[i].parentElement.innerText.slice(event.currentTarget[i].parentElement.innerText.indexOf("t"));
          var newStr = '';
          for (var j = 0; j < str.length; j++) {
            if (!(str[j] == '\n' || str[j] == '\r'))
              newStr += str[j];
          }
          newStr = newStr.replace(/[ ]/g, "")
          dataObject[event.currentTarget[i - 1].id].push(newStr);
        }
      }
      //Always add a date to the test request
      let today = (new Date).toUTCString();
      dataObject["date"] = today;

      //Always add an ID to each test
      //If this is the first test created mark it as "1"
      dataObject["id"] = typeof this.testsData[this.testsData.length - 1] != "undefined" ? this.testsData.length + 1 : 1;

      console.log(dataObject);
      return dataObject;
    }
    let data = tempData(event);
    this.http.post<any>('http://localhost:3001/tests', data, {}).subscribe();
  }
}



