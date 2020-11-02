import { Component, OnInit, HostBinding } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { HttpClient } from "@angular/common/http"
import { Tests } from '../tests-data/tests-data'



@Component({
  selector: 'app-test-automation',
  templateUrl: './test-automation.component.html',
  styleUrls: ['./test-automation.component.css']
})
export class TestAutomationComponent implements OnInit {
  @HostBinding('className') componentClass: string;

  constructor(private http: HttpClient) {
    this.componentClass = 'col-md-9 ml-sm-auto col-lg-10 px-md-4';
  }

  ngOnInit(): void {
  }

}
