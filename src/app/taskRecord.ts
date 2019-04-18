import { githubPullRequest } from './githubPullRequest';

export class taskRecord {
  public id: number;
  public index: number;
  public listId: number;
  public archived: boolean;
  
  public taskId: number;
  public pullRequestNumber: number;
  public title: string;
  public description: string;

  public repositoryName: string;
  public repositoryOwner: string;
  public pullRequest: githubPullRequest;

  constructor(data) {
    this.id = data.id;
    this.index = data.index;
    this.listId = data.list_id;
    this.archived = data.archived;

    this.taskId = data.task.id;
    this.pullRequestNumber = data.task.pr_number;
    this.title = data.task.title || '';
    this.description = data.task.description || '';

    this.repositoryName = data.task.repository.name;
    this.repositoryOwner = data.task.repository.user.name;
  };

  get repoTitle() {
    return `${this.repositoryOwner}/${this.repositoryName}`;
  }

  get displayTitle() {
    if (this.title !== '') return this.title;
    if (this.pullRequest && this.pullRequest.title !== '') return this.pullRequest.title;
    return `Task #${this.id}`;
  }

  get pullReq() {
    return this.pullRequest ? this.pullRequest : {};
  }

  get pullReqestState() {
    if (!this.pullRequest) return '';
    return this.pullRequest.state;
  }
}