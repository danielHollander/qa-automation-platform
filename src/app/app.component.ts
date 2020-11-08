import { Component, Input, OnInit } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';

import { UserService } from './services/user/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(private user: UserService, private router: Router) { }
  getProtectedData() {
    this.user.getProtectedData().subscribe((data: any) => {
      console.log(data)
    });
  }

  removeLoginClass = () => {
    if (document.body.className.indexOf("login") > -1 && window.location.pathname !== "/login") {
      document.body.className = '';
    }
  }

  ngOnInit() {
    this.getProtectedData();
    this.removeLoginClass();
  }

  ngDoCheck() {
    this.removeLoginClass();
  }


  logout() {
    localStorage.removeItem('Token');
    this.router.navigate(['/login']);
  }
}
