import { Component } from '@angular/core';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { Service } from '../dashboard.services';
import { forkJoin } from 'rxjs';

import { taskRecord } from '../taskRecord';
import { githubDataManager } from '../githubDataManager';
import { githubPullRequest } from '../githubPullRequest';

@Component({
  selector: 'dashboard',
  templateUrl: './dashboard.component.pug',
  styleUrls: ['./dashboard.component.scss']
})

export class DashboardComponent {
  private lists;
  private taskRecords = [];
  private processedLists;
  private showModal;
  private formData = {
    'username': 'octocat',
    'repo_owner': 'octocat',
    'repo_name': 'task-organiser',
    'pr_num': 1,
    'list_id': 1,
  };
  private githubData = new githubDataManager();

  private owner = 'octocat';
  private repo = 'hello-world';

  constructor(
    private service: Service,
    ) {
    this.showModal = false;

    this.service.getLists().subscribe(data => {
      this.lists = data;

      let internalTasks = this.service.getTasks();
      let githubAPI = this.service.getPulls();
      forkJoin([internalTasks, githubAPI]).subscribe(data => {
        Object.keys(data[0]).forEach(record => {
          this.taskRecords.push(new taskRecord(data[0][record]));
        });
        // console.log('Task Records', this.taskRecords);
  
        Object.keys(data[1]).forEach(pr => 
          this.githubData.addPullRequest(
            new githubPullRequest(this.owner, this.repo, data[1][pr])
          ));
        // console.log('GitHub Data', this.githubData);
  
        this.taskRecords.forEach(record => {
          const ghPullReq = this.githubData.extractPullRequest(
            record.repositoryOwner,
            record.repositoryName,
            record.pullRequestNumber
          );
          if (ghPullReq) record.pullRequest = ghPullReq;
        })
  
        Object.keys(this.githubData.pullRequests).forEach(user => {
          Object.keys(this.githubData.pullRequests[user]).forEach(repo => {
            this.githubData.pullRequests[user][repo].forEach(pullReq => {
              this.service.createTask({
                'username': 'octocat',
                'repo_owner': user,
                'repo_name': repo,
                'pr_num': pullReq.number,
                'list_id': Math.floor(Math.random() * 3 + 1),
              }).subscribe((record: { [key: string]: any }) => {
                const newRecord = new taskRecord(record)
                newRecord.pullRequest = pullReq;
                this.taskRecords.push(newRecord);
                this.sortTaskIntoLists();
              });
            });
          });
        })
        this.sortTaskIntoLists();
      })
    });
  }

  toggleModal() {
    this.showModal = !this.showModal;
  }

  get diagnostic() { return JSON.stringify(this.formData) }

  sortTaskIntoLists() {
    this.processedLists = this.lists.map(list => {
      list.taskRecords = this.taskRecords.filter(record => record.listId === list.id).sort((a, b) => a.index - b.index );
      return list;
    })
    console.log(this.processedLists)
  }

  drop(event: CdkDragDrop<string[]>) {
    console.log(event);

    const destinationListId = parseInt(event.container.element.nativeElement.getAttribute('data-list-id'), 10);

    const targetTask = this.taskRecords.find(task => task.id === event.previousContainer.data[event.previousIndex].id);
    const initialIndex = event.previousContainer.data[event.previousIndex].index;

    let destinationIndex;
    if (event.container.data.length === 0) {
      destinationIndex = initialIndex;
    } else if (event.currentIndex >= event.container.data.length) {
      destinationIndex = event.container.data[event.container.data.length - 1].index + 1;
    } else {
      destinationIndex = event.container.data[event.currentIndex].index;
    }

    console.log(initialIndex, destinationIndex);
    if (initialIndex < destinationIndex) { // Moving down the list
      this.taskRecords.forEach(task => {
        if (task.index > initialIndex && task.index <= destinationIndex) task.index--;
      })
    } else if (initialIndex > destinationIndex) {
      this.taskRecords.forEach(task => {
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

  archiveTask(taskId) {
    // this.service.archiveTask({
    //   username: 'octocat',
    //   taskId,
    // }).subscribe(data => {
    //   const targetTask = this.tasks.find(task => task.id === taskId);
    //   this.tasks.splice(this.tasks.indexOf(targetTask), 1);
    //   this.sortTaskIntoLists();
    // })
  }
}
