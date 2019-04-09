import { Component, Input } from '@angular/core';

@Component({
  selector: 'task-item',
  templateUrl: './task-item.component.pug',
  styleUrls: ['./task-item.component.scss']
})
export class TaskItemComponent {
  @Input('task') task: object;
}
