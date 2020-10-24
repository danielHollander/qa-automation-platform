import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { HttpClient } from "@angular/common/http"
import { Tests } from '../tests-data/tests-data'

@Component({
  selector: 'app-test-form',
  templateUrl: './test-form.component.html',
  styleUrls: ['./test-form.component.css']
})
export class TestFormComponent implements OnInit {
  postId: any;
  errorMessage: any;

  constructor(private http: HttpClient) { }
  testsData: Tests[];

  componentsArr = [{ component: '<app-form></app-form>', id: 0 }];

  sendToChild() {
    return this.componentsArr;
  }
  childToParent(arr) {
    this.componentsArr = arr;
  }

  private getDataFromServer = () => {
    const promise = this.http.get<Tests[]>('http://localhost:3001/tests').toPromise();
    promise.then((tests) => {
      this.testsData = tests;
    });
  }

  handeReset() {
    window.location.reload();
  }

  ngOnInit(): void {
    this.getDataFromServer();
    console.log(this.componentsArr);
  }

  ngDoCheck() {
    this.sendToChild()
  }

  onSubmit = (event: any) => {
    let tempData = (event: any) => {
      let dataObject = {};
      dataObject["name"] = event.currentTarget[0].value;
      for (var i = 0; i < event.currentTarget.length; i++) {
        if (event.currentTarget[i].type == "select-one" && event.currentTarget[i] != "custom") {
          dataObject[event.currentTarget[i].value] = event.currentTarget[i + 1].value;
        }
      }
      //Always add a date to the test request
      let today = (new Date).toUTCString();
      dataObject["date"] = today;

      //Always add an ID to each test
      //If this is the first test created mark it as "1"
      dataObject["id"] = typeof this.testsData[this.testsData.length - 1] != "undefined" ? this.testsData.length : 1;



      console.log(dataObject);
      return dataObject;
    }
    let data = tempData(event);
    this.http.post<any>('http://localhost:3001/tests', data, {}).subscribe();

    //For the mean time until a better solution will come up for tests Id
    //Refresh page on submit
    window.location.reload();
  }
}
