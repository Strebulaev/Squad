import { Component, OnInit } from '@angular/core';

export class Tab {
  constructor(public id: number, public name: string) { }
}

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.css']
})
export class NavMenuComponent implements OnInit {
  isExpanded = false;
  tabs: Tab[] = [];
  selectedTab: number = 0;

  collapse() {
    this.isExpanded = false;
  }

  toggle() {
    this.isExpanded = !this.isExpanded;
  }

  selectTab(tabId: number) {
    this.selectedTab = tabId;
  }
  showMenu(tab: string) {
    // Реализация функциональности показа меню по наведению
  }

  constructor() { }

  ngOnInit() {
    // Инициализация табов
    this.tabs = [
      new Tab(1, 'Викуша'),
      new Tab(2, 'Сергей'),
      new Tab(3, 'Илюша'),
      new Tab(4, 'Максимушка'),
      new Tab(5, 'Арсюша')
    ];
  }
}
