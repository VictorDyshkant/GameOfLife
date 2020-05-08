import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GameOfLifeComponent } from './game-of-life/game-of-life.component';
import { SmileComponent } from './smile/smile.component';
import { HomePageComponent } from './home-page/home-page.component';
import { MainComponent } from './main/main.component';

const childRoutes:Routes=[
   {  path:'', redirectTo:'home', pathMatch:'prefix'},
   {  path:'home',component:HomePageComponent },
   {  path:'gameOfLife', component : GameOfLifeComponent },
   {  path:'smile', component : SmileComponent },
   {  path:'**', redirectTo:'home', pathMatch:'prefix'}
  ];

const routes: Routes = [
    {  path:'main', children : childRoutes },
    {  path:'', redirectTo:'main',pathMatch:'prefix'  },
    {  path:'**', redirectTo:'main',pathMatch:'prefix'  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
