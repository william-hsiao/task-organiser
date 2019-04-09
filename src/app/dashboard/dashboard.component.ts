import { Component } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

@Component({
  selector: 'dashboard',
  templateUrl: './dashboard.component.pug',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
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
  toDo = [
    {
      id: 6,
      repoID: 1,
      prNumber: 6,
      title: 'Task 6',
      status: 'inProgress'
    },
    {
      id: 7,
      repoID: 1,
      prNumber: 7,
      title: 'Task 7',
      status: 'inProgress'
    },
    {
      id: 8,
      repoID: 1,
      prNumber: 8,
      title: 'Task 8',
      status: 'inProgress'
    }
  ]

  drop(event: CdkDragDrop<string[]>) {
    console.log(event);
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
                        event.container.data,
                        event.previousIndex,
                        event.currentIndex);
    }
  }
}
