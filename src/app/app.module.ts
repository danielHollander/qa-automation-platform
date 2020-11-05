import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from "@angular/common";
import { FormGroup, FormControl } from '@angular/forms';
import { AceEditorModule } from 'ngx-ace-editor-wrapper';


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
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    AceEditorModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
