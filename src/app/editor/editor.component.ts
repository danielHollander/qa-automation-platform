import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css']
})
export class EditorComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
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

  @Input("testsToEditor") multipleTests = false;
  @Input("customToEditor") customTest = false;
  @Input('editorsArrToChild') editorsArr = [{ component: '<app-editor></app-editor>' }]
  @Output() editorToForm = new EventEmitter<any>();

  sendToParent() {
    this.editorToForm.emit(this.editorsArr);
  }
  //Add editors according to counter
  onUpdateTestNumber(event) {
    console.log(event.target.value);
    if (this.editorsArr.length <= event.target.value) {
      for (var i = 1; i < event.target.value; i++) {
        this.editorsArr.push({ component: '<app-editor></app-editor>' });
      }
    }
    if (this.editorsArr.length > event.target.value) {
      for (var j = this.editorsArr.length; j > event.target.value; j--) {
        this.editorsArr.pop();
      }
    }
    this.sendToParent();
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

  //Add More editors according to user input
  onTestsNumber = (event) => {

  }
  editorTemplateArr = [];
}
