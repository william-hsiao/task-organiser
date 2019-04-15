import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'

@Injectable({ providedIn: 'root' })

export class Service {
  constructor(private http: HttpClient) {}

  getTasks() {
    return this.http.get('api/users?login=octocat')
  }

  createTask(data) {
    console.log(data);
    return this.http.post('api/records', data, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    })
  }

  updateTask(task, listId, previousListId) {
    console.log(task, listId, previousListId);
  }

  getPulls() {
    return this.http.get('https://api.github.com/repos/octocat/hello-world/pulls')
  }
}

/** Add Repo
 * 1. Get organizations/repo user belongs to
 * 2. Get use to select which repo to import
 * 3. Get all PR created after 2018/12/31 from GitHub (author/assignee, review, mentioned)
 * 4. Route GitHub response directly to Server
 * 5. Server adds
 *    - Repo entry
 *    - Per PR
 *      - Add PR record
 *      - For each involved user, add to their lists
 * 6. Retrieve user tasks
 */

/*
1. Get boards, lists, tasks from API
2. Fetch from GitHub API
3. 

*/

/** Move tasks
 * 
 */