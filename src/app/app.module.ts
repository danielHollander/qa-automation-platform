import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from "@angular/common";
import { FormGroup, FormControl } from '@angular/forms';
import { AceEditorModule } from 'ngx-ace-editor-wrapper';
import { QuillConfig, QuillModule } from "ngx-quill";
import * as Quill from "quill";
import QuillBetterTable from "quill-better-table";
import { FileDropDirective, FileSelectDirective } from 'ng2-file-upload';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DataComponent } from './data/data.component';
import { TestAutomationComponent } from './test-automation/test-automation.component';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { DashboardComponent } from './dashboard/dashboard.component';
import { TestFormComponent } from './test-form/test-form.component';
import { TestsDataComponent } from './tests-data/tests-data.component';
import { FormComponent } from './form/form.component';
import { LoginComponent } from './login/login.component';
import { EditorComponent } from './editor/editor.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpConfigInterceptor } from './intercepter/httpconfig.interceptor';
import { UploadComponent } from './upload/upload.component';
import { ProgressComponent } from './progress/progress.component';
import { DndDirective } from './dnd.directive';
import { SafePipe } from './safe.pipe';

Quill.register(
  {
    "modules/better-table": QuillBetterTable
  },
  true
);

const quillConfig: QuillConfig = {
  modules: {
    table: false, // disable table module
    "better-table": {
      operationMenu: {
        items: {
          unmergeCells: {
            text: "Another unmerge cells name"
          }
        },
        color: {
          colors: ["#fff", "red", "rgb(0, 0, 0)"], // colors in operationMenu
          text: "Background Colors" // subtitle
        }
      }
    },
    keyboard: {
      bindings: QuillBetterTable.keyboardBindings
    }
  }
};

@NgModule({
  declarations: [
    AppComponent,
    DataComponent,
    TestAutomationComponent,
    DashboardComponent,
    TestFormComponent,
    TestsDataComponent,
    FormComponent,
    LoginComponent,
    EditorComponent,
    UploadComponent,
    ProgressComponent,
    DndDirective,
    SafePipe,
    // FileSelectDirective
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    AceEditorModule,
    BrowserAnimationsModule,
    MatSnackBarModule,
    QuillModule.forRoot(quillConfig)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
