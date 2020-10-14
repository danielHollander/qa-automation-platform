import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { HttpClient } from "@angular/common/http"

@Component({
  selector: 'app-test-form',
  templateUrl: './test-form.component.html',
  styleUrls: ['./test-form.component.css']
})
export class TestFormComponent implements OnInit {
  postId: any;
  errorMessage: any;

  constructor(private http: HttpClient) { }


  ngOnInit(): void {
  }
  onSubmit = (event: any) => {
    console.log(`click: ${event.target[1].value}`);
    console.log(`URL: ${event.target[3].value}`);
    let data = { click: event.target[1].value, url: event.target[3].value }
    this.http.post<any>('http://localhost:3001/api', data, {}).subscribe();
  }
}
