import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './Components/home/home.component';
import { LoginComponent } from './Components/login/login.component';
import { RegisterComponent } from './Components/register/register.component';
import { NavBarComponent } from './Components/nav-bar/nav-bar.component';
import { NotFoundComponent } from './Components/not-found/not-found.component';
import { EventsComponent } from './Components/events/events.component';
import { ReservationComponent } from './Components/reservation/reservation.component';
import { RoomsComponent } from './Components/rooms/rooms.component';
import { HotelsComponent } from './Components/hotels/hotels.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NavBarComponent,
    LoginComponent,
    RegisterComponent,
    NotFoundComponent,
    EventsComponent,
    ReservationComponent,
    RoomsComponent,
    HotelsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
