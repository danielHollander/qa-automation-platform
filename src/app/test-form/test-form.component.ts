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
    let tempData = (event: any) => {
      let dataObject = {};
      dataObject["name"] = event.currentTarget[0].value;
      for (var i = 0; i < event.currentTarget.length; i++) {
        if (event.currentTarget[i].type == "checkbox" && event.currentTarget[i].value == "on") {
          dataObject[event.currentTarget[i].id] = event.currentTarget[i + 1].value;
        }
      }
      //Always add a date to the test request
      let today = (new Date).toUTCString();
      dataObject["date"] = today;

      console.log(dataObject);
      return dataObject;
    }
    let data = tempData(event);
    this.http.post<any>('http://localhost:3001/tests', data, {}).subscribe();
  }
}
