import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { MainMenuComponent } from './main-menu/main-menu.component';

import { TaskBoardComponent } from './home/task-board.component';
import { TaskListComponent } from './home/TaskList/task-list.component';

@NgModule({
  declarations: [
    AppComponent,
    MainMenuComponent,
    TaskBoardComponent,
    TaskListComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
