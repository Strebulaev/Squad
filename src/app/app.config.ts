import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { UserScope, buildAngularAuthConfig } from '@logto/js';
import { provideAuth } from 'angular-auth-oidc-client';
import { routes } from './app-routing.module';
import { provideClientHydration } from '@angular/platform-browser';
import { provideHttpClient, withFetch } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(),
    provideHttpClient(withFetch()),
    provideAuth({
      config: buildAngularAuthConfig({
        endpoint: '<your-logto-endpoint>',
        appId: '<your-app-id>',
        scopes: [UserScope.Email], // Добавьте больше областей, если нужно
        redirectUri: 'http://localhost:3000/callback',
        postLogoutRedirectUri: 'http://localhost:3000/',
      }),
    }),
  ]

};
