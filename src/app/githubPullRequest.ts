export class githubPullRequest {
  public repositoryOwner: string;
  public repositoryName: string;

  public state: string;
  public title: string;
  public number: number;
  public htmlUrl: string;
  public assignees: string[]; // difference between assignee & assignees?
  public reviewers: string[];
  public author: string;

  constructor(repositoryOwner: string, repositoryName: string, data: { [key: string]: any }) {
    this.repositoryOwner = repositoryOwner || '';
    this.repositoryName = repositoryName || '';

    this.state = data.state;
    this.title = data.title;
    this.number = data.number;
    this.htmlUrl = data.html_url;
    this.assignees = data.assignees;
    this.reviewers = data.requested_reviewers;
    this.author = data.user.login;
  };
};
