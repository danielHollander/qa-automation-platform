import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TestAutomationComponent } from './test-automation/test-automation.component'
import { DataComponent } from './data/data.component';
import { DashboardComponent } from './dashboard/dashboard.component'

const routes: Routes = [
  { path: 'test', component: TestAutomationComponent },
  { path: '', component: DashboardComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
