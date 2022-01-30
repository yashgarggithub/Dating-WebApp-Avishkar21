import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthComponent } from './app/auth/auth.component';
import { HomeComponent } from './app/home/home.component';
import { AuthGuard } from './app/auth/auth.guard';
import { ProfileComponent } from './app/home/profile/profilecomponent';
import { EditComponent } from './app/home/edit/edit.component';
import { FeedComponent } from './app/home/feed/feed.component';
import { ListComponent } from './app/home/socket-frontend/list/list.component';
const appRoutes: Routes = [
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: 'auth', component: AuthComponent },
    { path: 'home', component: HomeComponent
     ,children: [
        { path: '', component: HomeComponent ,canActivate: [AuthGuard]},
       
    ]
},
    { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard]},
    { path: 'edit' , component: EditComponent, canActivate: [AuthGuard]},
    { path: 'feed' , component: FeedComponent , canActivate: [AuthGuard]},
    // { path: ':id', component: ChatDataComponent}
    { path: 'list' , component: ListComponent , canActivate: [AuthGuard]}
]

@NgModule({
    imports: [RouterModule.forRoot(appRoutes)],
    exports: [RouterModule]
})

export class AppRoutingModule {}