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
  userName;
  getProtectedData() {
    this.user.getProtectedData().subscribe((data: any) => {
      console.log(data)
      this.userName = data[0].name;
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

  openMenu = (event) => {
    console.log(event);
    if (event.path[2].classList[0] == "notifications" || event.path[1].classList[0] == "notifications")
      document.querySelector('li.notifications ul.dropdown-menu.show') == null ? document.querySelector('li.notifications ul.dropdown-menu').classList.add("show") : document.querySelector('li.notifications ul.dropdown-menu').classList.remove("show");
    else
      document.querySelector('li.dropdown ul.dropdown-menu.fsz-sm.show') == null ? document.querySelector('li.dropdown ul.dropdown-menu.fsz-sm').classList.add("show") : document.querySelector('li.dropdown ul.dropdown-menu.fsz-sm').classList.remove("show");
  }

  logout() {
    localStorage.removeItem('Token');
    this.router.navigate(['/login']);
  }
}
