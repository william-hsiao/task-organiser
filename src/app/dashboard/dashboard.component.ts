import { Component } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Service } from '../dashboard.services';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'dashboard',
  templateUrl: './dashboard.component.pug',
  styleUrls: ['./dashboard.component.scss']
})

export class DashboardComponent {
  private lists;
  private showModal;
  private formData = {
    'username': 'octocat',
    'repo_owner': 'octocat',
    'repo_name': 'task-organiser',
    'pr_num': 1,
    'list_id': 1,
  };
  private githubData = {};

  constructor(
    private service: Service,
  ) {
    let internalLists = this.service.getTasks();
    let githubAPI = this.service.getPulls();
    forkJoin([internalLists, githubAPI]).subscribe(data => {
      this.lists = data[0];
      Object.keys(data[1]).forEach(pr => {
        if (!this.githubData['octocat']) this.githubData['octocat'] = {};
        if (!this.githubData['octocat']['hello-world']) this.githubData['octocat']['hello-world'] = [];
        this.githubData['octocat']['hello-world'].push({
          pr_num: data[1][pr].number,
          title: data[1][pr].title,
        });
      });

      this.lists.forEach(list => {
        list.task_records.forEach(record => {
          try {
            const ghData = this.githubData[record.task.repository.user.name][record.task.repository.name];
            const tmp = ghData.find(rec => rec.pr_num === record.task.pr_number);
            if (!tmp) return;
            console.log('Found', tmp);
            record.githubData = tmp;
            ghData.splice(ghData.indexOf(tmp), 1);
          } catch (e) {
            console.log('not found');
          }
        })
      })

      Object.keys(this.githubData).forEach(user => {
        Object.keys(this.githubData[user]).forEach(repo => {
          this.githubData[user][repo].forEach(pr => {
            this.service.createTask({
              'username': 'octocat',
              'repo_owner': user,
              'repo_name': repo,
              'pr_num': pr.pr_num,
              'list_id': Math.floor(Math.random() * 3 + 1),
            }).subscribe(data  => {
              data['githubData'] = pr;
              this.lists.find(list => list.id === data['list_id']).task_records.push(data)
            });
          });
        });
      })
    })

    // this.lists = this.service.getBoards();
    this.showModal = false;
  }

  toggleModal() {
    this.showModal = !this.showModal;
  }

  get diagnostic() { return JSON.stringify(this.formData) }

  taskTitle(record) {
    if (record.task.title !== '') return record.task.title;
    else if (!!record.githubData.title) return record.githubData.title;
    return '';
  }

  drop(event: CdkDragDrop<string[]>) {
    console.log(event);
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
    }

    const task = event.container.data[event.currentIndex];
    const listId = event.container.element.nativeElement.getAttribute('data-list-id')
    const previousListId = event.previousContainer.element.nativeElement.getAttribute('data-list-id')
    this.service.updateTask(task, listId, previousListId);
  }

  onSubmit() {
    this.service.createTask(this.formData).subscribe(data  => {
      this.lists.find(list => list.id === this.formData.list_id).task_records.push(data)
      this.showModal = false;
    });
  }
}
