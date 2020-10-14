import { Component, OnInit, HostBinding } from '@angular/core';
import { Data } from '../data/data'
import { DATAS } from '../data/mock-data'
import { HttpClient } from "@angular/common/http"
import { Observable } from 'rxjs';

@Component({
  selector: 'app-data',
  templateUrl: './data.component.html',
  styleUrls: ['./data.component.css']
})
export class DataComponent implements OnInit {
  constructor(private http: HttpClient) { }
  data: Data[];

  template: String = '';

  headers: String[] = [];
  renderHeaders = async () => {
    console.log(this.data);
    try {
      if (this.data.length > 0) {
        const tempHeaders = Object.values(this.data).map((obj, objectIndex, arr) => {
          if (obj.master == true)
            return Object.keys(obj).map(keys => keys !== "master" && keys !== "_id" && keys !== "__v" ? keys : '');
        })
        if (this.headers.length <= tempHeaders.length) {
          for (var i = 0; i < tempHeaders[0].length; i++) {
            this.headers.push(tempHeaders[0][i]);;
          }
        }
      }
    }
    catch (err) {
      console.log(err);
    }
  }
  values = [];
  renderValuesData = () => {
    this.values = Object.values(this.data).map((object, objectIndex, array) => {
      const allowed = [
        "id",
        "website",
        "actions",
        "tag",
        "implementaion",
        "cmp",
        "percentagePC",
        "percentageTablet",
        "percentageMobile",
        "totalPlacements",
        "requests",
        "imp",
        "revenue"
      ];
      const filtered = Object.keys(object)
        .filter(key => allowed.includes(key))
        .reduce((obj, key) => {
          return {
            ...obj,
            [key]: object[key]
          };
        }, {});
      return Object.values(filtered).map((property, index, arr) => typeof property != "undefined" ? property.toString() : '');
    })
  }

  private getDataFromServer = () => {
    const promise = this.http.get<Data[]>('http://localhost:3001/api').toPromise();
    console.log(promise);
    promise.then((data) => {
      this.data = data;
      this.renderHeaders();
      this.renderValuesData();
    })
  }

  async ngOnInit() {
    this.getDataFromServer()
  }

}
