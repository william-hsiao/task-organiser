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
  private tasks;
  private processedLists;
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
    this.service.getLists().subscribe(data => {
      this.lists = data;

      let internalTasks = this.service.getTasks();
      let githubAPI = this.service.getPulls();
      forkJoin([internalTasks, githubAPI]).subscribe(data => {
        this.tasks = data[0];
  
        Object.keys(data[1]).forEach(pr => {
          if (!this.githubData['octocat']) this.githubData['octocat'] = {};
          if (!this.githubData['octocat']['hello-world']) this.githubData['octocat']['hello-world'] = [];
          this.githubData['octocat']['hello-world'].push({
            pr_num: data[1][pr].number,
            title: data[1][pr].title,
          });
        });
  
        this.tasks.forEach(record => {
          try {
            const ghData = this.githubData[record.task.repository.user.name][record.task.repository.name];
            const tmp = ghData.find(rec => rec.pr_num === record.task.pr_number);
            if (!tmp) return;
            // console.log('Found', tmp);
            record.githubData = tmp;
            ghData.splice(ghData.indexOf(tmp), 1);
          } catch (e) {
            // console.log('not found');
          }
        })
  
        // console.log('Lists: ', this.lists)
        // console.log('Tasks: ', this.tasks);
        // console.log('GitHub Data: ', this.githubData);
  
        Object.keys(this.githubData).forEach(user => {
          Object.keys(this.githubData[user]).forEach(repo => {
            this.githubData[user][repo].forEach(pr => {
              this.service.createTask({
                'username': 'octocat',
                'repo_owner': user,
                'repo_name': repo,
                'pr_num': pr.pr_num,
                'list_id': Math.floor(Math.random() * 3 + 1),
              }).subscribe(dta  => {
                console.log(dta);
                dta['githubData'] = pr;
                this.tasks.push(dta)
                this.sortTaskIntoLists();
              });
            });
          });
        })
        this.sortTaskIntoLists();
      })
    });

    // this.lists = this.service.getBoards();
    this.showModal = false;
    // console.log(this.sortedLists)
  }

  toggleModal() {
    this.showModal = !this.showModal;
  }

  get diagnostic() { return JSON.stringify(this.formData) }

  sortTaskIntoLists() {
    this.processedLists = this.lists.map(list => {
      list.task_records = this.tasks.filter(task => task.list_id === list.id).sort((a, b) => a.index - b.index );
      return list;
    })
    console.log(this.processedLists)
  }

  drop(event: CdkDragDrop<string[]>) {
    console.log(event);

    const destinationListId = parseInt(event.container.element.nativeElement.getAttribute('data-list-id'), 10);

    const targetTask = this.tasks.find(task => task.id === event.previousContainer.data[event.previousIndex].id);
    const initialIndex = event.previousContainer.data[event.previousIndex].index;

    let destinationIndex;
    if (event.currentIndex >= event.container.data.length) {
      destinationIndex = event.container.data[event.container.data.length - 1].index + 1;
    } else {
      destinationIndex = event.container.data[event.currentIndex].index;
    }

    console.log(initialIndex, destinationIndex);
    if (initialIndex < destinationIndex) { // Moving down the list
      this.tasks.forEach(task => {
        if (task.index > initialIndex && task.index <= destinationIndex) task.index--;
      })
    } else if (initialIndex > destinationIndex) {
      this.tasks.forEach(task => {
        if (task.index >= destinationIndex && task.index < initialIndex) task.index++;
      })
    }
    
    targetTask.index = destinationIndex;
    targetTask.list_id = destinationListId;

    // console.log('initial', initialIndex);
    // console.log('final', destinationIndex);
    // console.log(targetTask);
    // console.log(this.tasks)
    this.sortTaskIntoLists();
    this.service.updateTask({
      username: 'octocat',
      targetTaskId: targetTask.id,
      destinationListId,
      initialIndex,
      destinationIndex,
    }).subscribe(res => console.log(res));
  }

  onSubmit() {
    this.service.createTask(this.formData).subscribe(data  => {
      this.lists.find(list => list.id === this.formData.list_id).task_records.push(data)
      this.showModal = false;
    });
  }
}
