import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import 'brace';
import 'brace/mode/sql';
import { AceEditorComponent } from 'ngx-ace-editor-wrapper';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {
  //For test input option values
  testsOptions = [
    "Click",
    "Navigaton",
    "Expect",
    "Equals",
    "Type Text",
    "Browser Log",
    "Custom",
    "Multiple Tests",
  ]

  @Input("FormToEditor") testsValues = [
    "click",
    "navigateTo",
    "expect",
    "eql",
    "typeText",
    "getBrowserConsoleMessages",
    "custom",
    "multipleTests"
  ]
  constructor() { }

  ngOnInit(): void {
  }
  @Output() childToParent = new EventEmitter<any>();

  sendToParent() {
    this.childToParent.emit(this.componentsArr);
  }

  parentToChild(arr) {
    console.log(arr);
    this.componentsArr = arr;
  }

  @Input('MasterToChild') componentsArr = [{ component: '<app-form></app-form>', id: 0 }];
  editorsArr = [{ component: '<app-editor></app-editor>', id: 0 }];

  handleIncrement(event: any) {
    console.log("increasing!");
    let newID = this.componentsArr.length;
    this.componentsArr.push(
      { component: '<app-form></app-form>', id: newID }
    )

    this.sendToParent();
  }

  handleDecrement(event: any) {
    console.log("Decreasing!");
    let form = event.path.find((value, index) => value.localName == "app-form");
    let formId = parseInt(form.id);
    this.componentsArr = this.componentsArr.filter(component => {
      if (component.id !== formId)
        return component;
    });

    this.sendToParent();
    console.log(this.componentsArr);
  }

  //For code editor and mutiple tests
  @Input("testsToEditor") multipleTests = false;
  @Input("customToEditor") customTest = false;
  onCustomTestChange = (event) => {
    if (event.target != null) {
      if (event.target.value == "custom") {
        this.customTest = true;
        this.multipleTests = false;
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
}
