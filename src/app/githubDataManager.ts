import { githubPullRequest } from './githubPullRequest';

export class githubDataManager {
  public pullRequests = {};

  empty() {
    this.pullRequests = {};
  }

  addPullRequest(pullReq: githubPullRequest) {
    if (!this.pullRequests[pullReq.repositoryOwner]) this.pullRequests[pullReq.repositoryOwner] = {};

    if (!this.pullRequests[pullReq.repositoryOwner][pullReq.repositoryName]) this.pullRequests[pullReq.repositoryOwner][pullReq.repositoryName] = [];

    this.pullRequests[pullReq.repositoryOwner][pullReq.repositoryName].push(pullReq);
  }

  extractPullRequest(owner: string, repo: string, number: number) {
    if (!this.pullRequests[owner] || !this.pullRequests[owner][repo]) return;

    const pullReq = this.pullRequests[owner][repo].find(pullReq => pullReq.number === number);
    if (!pullReq) return;

    this.pullRequests[owner][repo].splice(this.pullRequests[owner][repo].indexOf(pullReq), 1);
    return pullReq;
  }
}