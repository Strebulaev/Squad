import { Component, OnInit } from '@angular/core';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import type { UserInfoResponse } from '@logto/js';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})

export class HomeComponent implements OnInit {
  isAuthenticated = false;
  userData?: UserInfoResponse;
  idToken?: string;
  accessToken?: string;
  constructor(public oidcSecurityService: OidcSecurityService) { }

  ngOnInit() {
    this.oidcSecurityService
      .checkAuth()
      .subscribe(({ isAuthenticated, userData, idToken, accessToken }) => {
        console.log('app authenticated', isAuthenticated, userData);
        this.isAuthenticated = isAuthenticated;
        this.userData = userData;
        this.idToken = idToken;
        this.accessToken = accessToken;
      });
  }

  signIn() {
    this.oidcSecurityService.authorize();
  }

  signOut() {
    this.oidcSecurityService.logoff().subscribe((result) => {
      console.log('выход из приложения', result);
    });
  }
}
