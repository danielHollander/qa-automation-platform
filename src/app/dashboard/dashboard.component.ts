import { Component, OnInit, HostBinding } from '@angular/core';
import { ChartType, ChartOptions } from 'chart.js';
import { Label } from 'ng2-charts';
import * as pluginDataLabels from 'chartjs-plugin-datalabels';
import { UserService } from '../services/user/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  @HostBinding('className') componentClass: string;

  constructor(private user: UserService, private router: Router) {
    this.componentClass = 'col-md-9 ml-sm-auto col-lg-10 px-md-4';
  }
  users;
  getProtectedData() {
    this.user.getProtectedData().subscribe((data: any) => {
      console.log(data)
      this.users = data;
    });
  }

  public pieChartOptions: ChartOptions = {
    responsive: true,
    legend: {
      position: 'top',
    },
    plugins: {
      datalabels: {
        formatter: (value, ctx) => {
          const label = ctx.chart.data.labels[ctx.dataIndex];
          return label;
        },
      },
    }
  };
  public pieChartLabels: Label[] = ['Total Failed Tests', 'Total Successfull Tests', 'Pending Tests'];
  public pieChartData: number[] = [5, 8, 0];
  public pieChartType: ChartType = 'pie';
  public pieChartLegend = true;
  public pieChartPlugins = [pluginDataLabels];
  public pieChartColors = [
    {
      backgroundColor: ['rgba(255,0,0,0.3)', 'rgba(0,255,0,0.3)', 'rgba(0,0,255,0.3)'],
    },
  ];

  ngOnInit() {
    this.getProtectedData();
  }

}
