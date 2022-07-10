import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './Components/home/home.component';
import { LoginComponent } from './Components/login/login.component';
import { NotFoundComponent } from './Components/not-found/not-found.component';
import { RegisterComponent } from './Components/register/register.component';
import { HotelsComponent } from './Components/hotels/hotels.component';
import { EventsComponent } from './Components/events/events.component';
import { ReservationComponent } from './Components/reservation/reservation.component';
import { RoomsComponent } from './Components/rooms/rooms.component';


const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'home', component: HomeComponent},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'hotels', component: HotelsComponent},
  {path: 'events', component: EventsComponent},
  {path: 'reservation', component: ReservationComponent},
  {path: 'rooms', component: RoomsComponent},
  {path: '**', component: NotFoundComponent}
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
