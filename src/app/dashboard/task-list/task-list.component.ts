import { Component } from '@angular/core';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';

@Component({
  selector: 'task-list',
  templateUrl: './task-list.component.pug',
  styleUrls: ['./task-list.component.scss']
})

export class TaskListComponent {
  tasks = [
    {
      id: 1,
      repoID: 1,
      prNumber: 1,
      title: 'Task 1',
      status: 'inProgress'
    },
    {
      id: 2,
      repoID: 1,
      prNumber: 2,
      title: 'Task 2',
      status: 'toReview'
    },
    {
      id: 3,
      repoID: 1,
      prNumber: 3,
      title: 'Task 3',
      status: 'inProgress'
    },
    {
      id: 4,
      repoID: 1,
      prNumber: 4,
      title: 'Task 4',
      status: 'done'
    },
    {
      id: 5,
      repoID: 1,
      prNumber: 5,
      title: 'Task 5',
      status: 'inProgress'
    },
  ]

  drop(task: CdkDragDrop<object>) {
    console.log('Item dropped');
    moveItemInArray(this.tasks, task.previousIndex, task.currentIndex);
  }
}
