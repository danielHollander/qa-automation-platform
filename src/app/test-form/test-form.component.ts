import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { HttpClient } from "@angular/common/http"
import { Tests } from '../tests-data/tests-data'
import { TestsDataComponent } from '../tests-data/tests-data.component'
import { MatStepperModule } from '@angular/material/stepper';



@Component({
  selector: 'app-test-form',
  templateUrl: './test-form.component.html',
  styleUrls: ['./test-form.component.css']
})
export class TestFormComponent implements OnInit {
  postId: any;
  errorMessage: any;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  isEditable = true;
  isLinear = false;
  constructor(private http: HttpClient, private _formBuilder: FormBuilder) { }
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


  ngOnInit(): void {
    this.getDataFromServer();
    this.firstFormGroup = this._formBuilder.group({
      firstCtrl: ['', Validators.required]
    });
    this.secondFormGroup = this._formBuilder.group({
      secondCtrl: ['', Validators.required]
    });
  }

  ngDoCheck() {
    this.sendToChild()
  }

  onUpdateTestName(event: Event) {
    this.testName = (<HTMLInputElement>event.target).value;
  }


  onSubmit = (event: any) => {
    debugger;
    console.log(this.testsData);
    // let tempData = (event: any) => {
    //   let dataObject = {};
    //   dataObject["name"] = event.currentTarget[0].value;
    //   for (var i = 0; i < event.currentTarget.length; i++) {
    //     if (event.currentTarget[i].type == "select-one" && event.currentTarget[i].value != "custom" && event.currentTarget[i].value != "multipleTests" && event.currentTarget[i].value != "multipleTests") {
    //       if (typeof dataObject[event.currentTarget[i].value] == "undefined") {
    //         if (event.currentTarget[i].value == "typeText") {
    //           dataObject[event.currentTarget[i].value] = [];
    //           dataObject[event.currentTarget[i].value].push(event.currentTarget[2].value.split(", "));
    //         } else {
    //           dataObject[event.currentTarget[i].value] = [];
    //           dataObject[event.currentTarget[i].value].push(event.currentTarget[i + 1].value);
    //         }
    //       } else
    //         dataObject[event.currentTarget[i].value].push(event.currentTarget[i + 1].value);
    //     }
    //     //Handle custom test script and make sure the input will be a one liner
    //     if (event.currentTarget[i].classList.value == "ace_text-input" && event.currentTarget[i].parentElement.hidden == false) {
    //       dataObject[event.currentTarget[i - 1].id] = dataObject[event.currentTarget[i - 1].id] || [];
    //       var str = event.currentTarget[i].parentElement.innerText.slice(event.currentTarget[i].parentElement.innerText.indexOf("t"));
    //       var newStr = '';
    //       for (var j = 0; j < str.length; j++) {
    //         if (!(str[j] == '\n' || str[j] == '\r'))
    //           newStr += str[j];
    //       }
    //       newStr = newStr.replace(/[ ]/g, "")
    //       dataObject[event.currentTarget[i - 1].id].push(newStr);
    //     }
    //   }
    //   //Always add a date to the test request
    //   let today = (new Date).toString().split(" GMT")[0];
    //   dataObject["date"] = today;

    //   //Always add an ID to each test
    //   //If this is the first test created mark it as "1"
    //   dataObject["id"] = typeof this.testsData[this.testsData.length - 1] != "undefined" ? this.testsData.length + 1 : 1;

    //   console.log(dataObject);
    //   return dataObject;
    // }
    // let data = tempData(event);
    this.http.post<any>('http://localhost:3001/tests', this.tempData, {}).subscribe();
  }

  isCustom = false;
  changeCustomSetting = (event) => {
    if (event.target.checked)
      this.isCustom = true;
    else
      this.isCustom = false;
    console.log(this.isCustom);
  }
  //For code editor and mutiple tests
  editorsArr = [{ component: '<app-editor></app-editor>', id: 0 }];
  @Input("testsToEditor") multipleTests = false;
  @Input("customToEditor") customTest = false;
  onCustomTestChange = (event) => {
    if (event.target != null) {
      if (event.target.value == "custom") {
        this.customTest = true;
        this.editorsArr = [{ component: '<app-editor></app-editor>', id: 0 }];
        console.log("custom test " + this.customTest);
        console.log("multiple tests " + this.multipleTests);
      }
      if (event.target.value == "multipleTests") {
        this.multipleTests = true;
        this.customTest = false;
        console.log("multiple tests " + this.multipleTests);
        console.log("custom test " + this.customTest);
      }
      if (event.target.value !== "multipleTests" && event.target.value !== "custom") {
        this.customTest = false;
        this.multipleTests = false;
      }
    }
  }
  editorToForm = (arr) => {
    this.editorsArr = arr;
    console.log(this.editorsArr);
  }
  tempData = {
    id: 1,
    name: '',
    featureName: '',
    expectedResult: '',
    technicalEntry: '',
    date: (new Date).toString().split(" GMT")[0]
  };
  onNext = (event) => {
    console.log(event);
  }

  onKeyPress = (event) => {
    this.tempData.id = typeof this.testsData[this.testsData.length - 1] != "undefined" ? this.testsData.length + 1 : 1;
    const prop = event.target.name;
    switch (prop) {
      case "name":
        this.tempData.name = event.target.value;
        break;
      case "feature-name":
        this.tempData.featureName = event.target.value;
        break;
      case "expected-result":
        this.tempData.expectedResult = event.target.value
        break;
      case "technical-entry":
        this.tempData.technicalEntry = event.target.value;
        break;
      case "test-param":
        this.tempData[event.target.parentElement.parentElement.children[1].value] = event.target.value;
      default:
        this.formatCustomEditor();
        this.tempData["custom"] = this.customTestArr;
        break;
    }

    console.log(this.tempData);
  }
  customTestArr = [];
  formatCustomEditor() {
    this.customTestArr = [];
    var editorArr = document.querySelectorAll('ace-editor');
    for (var i = 0; i < editorArr.length; i++) {
      var str = editorArr[i].parentElement.innerText.slice(editorArr[i].parentElement.innerText.indexOf("t"));
      var newStr = '';
      for (var j = 0; j < str.length; j++) {
        if (!(str[j] == '\n' || str[j] == '\r'))
          newStr += str[j];
      }
      newStr = newStr.replace(/[ ]/g, "");

      this.customTestArr.push(newStr);
    }
  }
  ngAfterViewChecked() {
    const stepperHeaderArr = document.querySelectorAll('.mat-step-header');
    for (var i = 0; i < stepperHeaderArr.length; i++) {
      stepperHeaderArr[i].addEventListener("click", this.onKeyPress);
    };


    const formFieldsArr = document.querySelectorAll('.mat-form-field-infix > input, #test-param-input, ace-editor');
    for (var i = 0; i < formFieldsArr.length; i++) {
      formFieldsArr[i].addEventListener("keyup", this.onKeyPress);
    };
  }
}


