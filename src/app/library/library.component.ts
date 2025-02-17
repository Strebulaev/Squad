import { Component } from '@angular/core';

@Component({
  selector: 'app-library',
  templateUrl: './library.component.html',
  styleUrls: ['./library.component.css']
})
export class LibraryComponent {
  activeTab: string = 'fantasy';

  fantasyBooks = [
    { title: 'Хоббит: Туда и обратно', read: false },
    { title: 'Властелин Колец: хранители кольца', read: false },
    { title: 'Властелин Колец: Две твердыни', read: false },
    { title: 'Властелин Колец: Возвращение короля', read: false },
    { title: 'Сильмариллион', read: false },
    { title: 'Неоконченные предания Нуменора и Средиземья', read: false },
    { title: 'Дети Хурина', read: false },
    { title: 'Берен и Лутиэн', read: false },
    { title: 'Падение Гондолина', read: false },
    { title: 'Песни Белерианда', read: false },
    { title: 'Устроение Средиземья', read: false },
    { title: 'Князь света', read: false },
    { title: 'Девять принцев Амбера', read: false },
    { title: 'Цивилизация статуса', read: false },
    { title: 'Пират против всей галактики', read: false },
    { title: 'Голубятня на жёлтой поляне', read: false },
    { title: 'МИФ', read: false },
    { title: 'Ведьмак', read: false },
    { title: 'Скандинавские боги', read: false },
    { title: 'Ключи от королевства', read: false },
    { title: 'Часодеи', read: false }
  ];

  detectiveBooks = [
    { title: 'Шерлок Холмс', read: false }
  ];

  sciFiBooks = [
    { title: 'Дюна', read: false },
    { title: '1984', read: false },
  ];

  horrorBooks = [
    { title: '1984', read: false },
  ];

  novelBooks = [
    { title: 'Дориан Грей', read: false },
    { title: 'Мастер и Маргарита', read: false }
  ];

  historyBooks = [
    { title: 'Библия', read: false }
  ];

  unpublishedBooks = [
    { title: 'Лор Атласа', read: false },
    { title: 'Бронзовая медь', read: false }
  ];

  selectTab(tab: string) {
    this.activeTab = tab;
  }

  updateReadStatus(book: any) {
    console.log(`${book.title} is now ${book.read ? 'read' : 'unread'}`);
  }
}
