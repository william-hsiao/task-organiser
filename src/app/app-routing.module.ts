import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TaskBoardComponent } from './home/task-board.component';

const routes: Routes = [
  { path: '', component: TaskBoardComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
