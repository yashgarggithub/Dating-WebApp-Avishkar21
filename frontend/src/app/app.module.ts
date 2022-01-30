import { NgModule } from '@angular/core';
import { AuthInterceptorSercvice } from './auth/auth.interceptor';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { AppComponent } from './app.component';
import {HttpClientModule , HTTP_INTERCEPTORS} from '@angular/common/http'
import { LoadingSpinnerComponent } from 'src/loading-spinner/loading-spinner.component';
import { AppRoutingModule } from 'src/app.routes';
import { AuthComponent } from './auth/auth.component';
import { HomeComponent } from './home/home.component';
import { ProfileComponent } from './home/profile/profilecomponent';
import { EditComponent } from './home/edit/edit.component';
import { FeedComponent } from './home/feed/feed.component';
import { DisplayComponent } from './home/feed/display/display.component';
import { ChatInboxComponent } from './home/socket-frontend/chat-inbox.component';
import { RoomComponent } from './home/socket-frontend/rooms/rooms.component';
import { RouterModule } from '@angular/router';
import { ListComponent } from './home/socket-frontend/list/list.component';
import {AngularFireStorageModule} from '@angular/fire/compat/storage/'
import {AngularFireModule} from '@angular/fire/compat'
@NgModule({
  declarations: [
    AppComponent,
    LoadingSpinnerComponent,
    AuthComponent,
    HomeComponent,
    ProfileComponent,
    EditComponent,
    FeedComponent,
    DisplayComponent,
    ChatInboxComponent,
    RoomComponent,
    ListComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp({
      apiKey: "AIzaSyAgbo7JJS0rppDNmLy6NkYaUNjt6HV6OwQ",
  authDomain: "avishkar2021-c5c34.firebaseapp.com",
  projectId: "avishkar2021-c5c34",
  storageBucket: "avishkar2021-c5c34.appspot.com",
  messagingSenderId: "653935370891",
  appId: "1:653935370891:web:427dcd39ab9eff88aeea8e",
  measurementId: "G-ESF2E7XLSK"
    }),
    AngularFireStorageModule
    // ,
    // RouterModule
  ],
  exports: [RouterModule],
  providers: [CookieService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorSercvice,
      multi: true,
      }],
  bootstrap: [AppComponent]
})
export class AppModule { }
