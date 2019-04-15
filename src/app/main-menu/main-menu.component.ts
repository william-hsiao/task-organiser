import { Component, HostBinding } from '@angular/core';

@Component({
  selector: 'main-menu',
  templateUrl: './main-menu.component.pug',
  styleUrls: ['./main-menu.component.scss']
})
export class MainMenuComponent {
  title = 'task-organiser-angular';
  user = {
    name: 'Octocat',
    avatar_url: 'https://avatars3.githubusercontent.com/u/583231?v=4',
  }

  @HostBinding('class.expand') expandMenu: boolean = false;
  showExpandedItems = false;

  toggleMenu() {
    if (this.expandMenu) {
      this.expandMenu = !this.expandMenu;
      this.showExpandedItems = !this.showExpandedItems;
    } else {
      this.expandMenu = !this.expandMenu;
      setTimeout(() => this.showExpandedItems = !this.showExpandedItems, 300);
    }
  }
}
