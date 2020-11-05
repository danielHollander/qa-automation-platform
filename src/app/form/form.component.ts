import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';

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

  testsValues = [
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
  multipleTests = false;
  customTest = false;
  onCustomTestChange = (event) => {
    if (event.target != null) {
      if (event.target.value == "custom") {
        this.customTest = true;
        this.multipleTests = false;
        console.log(this.customTest);
      }
      if (event.target.value == "multipleTests") {
        this.multipleTests = true;
        this.customTest = false;
        console.log(this.customTest);
      }
      if (event.target.value !== "multipleTests" && event.target.value !== "custom") {
        this.customTest = false;
        this.multipleTests = false;
      }
    }
  }

  //Code editor text
  text: string = "";
  options: any = { maxLines: 1000, printMargin: false };

  //Log changes in custom code
  onCodeChange(code) {
    console.log(code);
  }

  @ViewChild('editor') editor;
  ngAfterViewInit() {
    this.editor.setTheme("eclipse");

    this.editor.getEditor().setOptions({
      enableBasicAutocompletion: true
    });

    this.editor.getEditor().commands.addCommand({
      name: "showOtherCompletions",
      bindKey: "Ctrl+L",
      exec: function (editor) {

      }
    })
  }
}
