import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {
  testsOptions = [
    "Click",
    "Navigaton",
    "Expect",
    "Equals",
    "Type Text",
    "Browser Log",
    "Custom",
  ]

  testsValues = [
    "click",
    "navigateTo",
    "expect",
    "eql",
    "typeText",
    "getBrowserConsoleMessages",
    "custom",
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
}
