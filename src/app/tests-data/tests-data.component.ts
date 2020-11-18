import { Component, OnInit } from '@angular/core';
import { Tests } from '../tests-data/tests-data'
import { Comments } from '../tests-data/comments'
import { HttpClient } from "@angular/common/http"
import { Observable, Subscription } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { ChangeDetectionStrategy } from "@angular/core";
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { UserService } from '../services/user/user.service';

interface Quill {
  getModule(moduleName: string);
}

@Component({
  selector: 'app-tests-data',
  templateUrl: './tests-data.component.html',
  styleUrls: ['./tests-data.component.css'],
})
export class TestsDataComponent implements OnInit {
  constructor(private http: HttpClient, private user: UserService, private router: Router) { }
  testsData: Tests[];
  commentsData: Comments[];


  getDataFromServer = () => {
    const promise = this.http.get<Tests[]>('http://localhost:3001/tests').toPromise();
    promise.then((tests) => {
      this.testsData = tests;
      this.renderHeaders();
      this.renderValuesData();
    });
  }

  getCommentsDataFromServer = () => {
    const promise = this.http.get<Comments[]>('http://localhost:3001/comments').toPromise();
    promise.then((comments) => {
      this.commentsData = comments;
      console.log(this.commentsData);
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
                // case "click":
                //   return "Click Parameter"
                // case "navigateTo":
                //   return "Navigation Parameter"
                // case "expect":
                //   return "Expected Test Result Parameter"
                // case "eql":
                //   return "Expected Test Result will Equall to Parameter"
                // case "typeText":
                //   return "Typed Text Parameter"
                // case "getBrowserConsoleMessages":
                //   return "Browser Console Message Parameter"
                // case "custom":
                //   return "Custom Test"
                // case "multipleTests":
                //   return "Multiple Tests"
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
        "status",
        "duration",
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
    this.getCommentsDataFromServer();
    this.getProtectedData();

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

      const commentsPromise = this.http.get<Comments[]>('http://localhost:3001/comments').toPromise();
      commentsPromise.then((comments) => {
        this.commentsData = comments;
        console.log(comments);
      });
    }, 10000);
  }


  //Handle popup status for full report
  popup = false;
  testPopUp = false;
  testFullReport;
  testStatus;
  testName;
  testSpecs = [];
  testDate;
  testDuration;
  commentsArr = [];
  testDetailes;
  testId;
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

  displayFullTestInfo = (event) => {
    console.log(event);
    this.testId = event.target.innerText;
    this.testSpecs = [];
    this.commentsArr = [];
    this.testPopUp = true;
    console.log(this.testsData);

    const getTestName = (data, event) => {
      for (var i = 0; i < data.length; i++) {
        if (event.target.innerText == data[i].id[0]) {
          this.testName = data[i].name;
          return;
        }
      }
    }
    const getTestStatus = (data, event) => {
      for (var i = 0; i < data.length; i++) {
        if (event.target.parentElement.parentElement.children[0].innerText == data[i].id[0]) {
          if (data[i].status == 1)
            this.testStatus = "Success"
          else
            this.testStatus = "Failed"
          return;
        }
      }
    }

    const getTestParams = (data, event) => {
      for (var i = 0; i < data.length; i++) {
        if (event.target.parentElement.parentElement.children[0].innerText == data[i].id[0]) {
          this.testSpecs.push(data[i]);
          return;
        }
      }
    }

    const getTestDuration = (data, event) => {
      for (var i = 0; i < data.length; i++) {
        if (event.target.parentElement.parentElement.children[0].innerText == data[i].id[0]) {
          this.testDuration = data[i].duration;
          return;
        }
      }
    }
    const getTestDate = (data, event) => {
      for (var i = 0; i < data.length; i++) {
        if (event.target.parentElement.parentElement.children[0].innerText == data[i].id[0]) {
          this.testDate = data[i].date;
          return;
        }
      }
    }

    const getFullTestReport = (data, event) => {
      for (var i = 0; i < data.length; i++) {
        if (event.target.parentElement.parentElement.children[0].innerText == data[i].id[0]) {
          this.testFullReport = data[i].fullReport[0];
          return;
        }
      }
    }

    const getComments = (comments, event) => {
      for (var i = 0; i < comments.length; i++) {
        if (event.target.innerText == comments[i].id) {
          this.commentsArr.push(comments[i]);
        }
      }
    }
    getTestName(this.testsData, event);
    getTestStatus(this.testsData, event);
    getTestParams(this.testsData, event);
    getTestDuration(this.testsData, event);
    getTestDate(this.testsData, event);
    getFullTestReport(this.testsData, event);
    getComments(this.commentsData, event);
  }

  ngAfterViewChecked() {
    const nonClickableElementsArray = document.querySelectorAll('.text-success, .text-danger');
    for (var i = 0; i < nonClickableElementsArray.length; i++) {
      nonClickableElementsArray[i].addEventListener("click", this.getFullTestLog);
    };

    const testIdsArr = document.querySelectorAll('.id');
    for (var i = 0; i < testIdsArr.length; i++) {
      testIdsArr[i].addEventListener("click", this.displayFullTestInfo);
    };

    const commentBoxArr = document.querySelectorAll('.ql-editor');
    for (var i = 0; i < commentBoxArr.length; i++) {
      commentBoxArr[i].addEventListener("click", this.showComment);
    };

  }

  quill: Quill;

  sendComment = true;
  canAnimate = false;
  editorCreated(event: Quill): void {
    this.quill = event;
    console.log(event);
    // Example on how to add new table to editor
  }

  clearComment = (event) => {
    event.stopPropagation()
    this.sendComment = true;
  }

  onSubmit = (event) => {
    this.canAnimate = true;
    console.log(event.target.innerText);
    let _id = parseInt(document.querySelector<HTMLElement>('.test-full-details').id);

    let commentsData = { id: _id, comment: event.target.innerText, date: (new Date()).toUTCString(), user: this.userName };
    this.commentsArr.push(commentsData)
    this.http.post<any>('http://localhost:3001/comments', commentsData, {}).subscribe();
  }

  showComment = (event) => {
    event.stopPropagation();
    this.sendComment = false;
  }

  userName;
  getProtectedData() {
    this.user.getProtectedData().subscribe((user: any) => {
      this.userName = user[0].name;
      console.log(this.userName);
    });
  }
}
