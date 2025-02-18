import { Component, OnInit } from '@angular/core';

export interface Book {
  title: string;
  read: boolean;
}

@Component({
  selector: 'app-library',
  templateUrl: './library.component.html',
  styleUrls: ['./library.component.css'],
})
export class LibraryComponent implements OnInit {
  activeTab: string = 'Fantasy';

  fantasyBooks: Book[] = [
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

  detectiveBooks: Book[] = [
    { title: 'Шерлок Холмс', read: false }
  ];

  sciFiBooks: Book[] = [
    { title: 'Дюна', read: false },
    { title: '1984', read: false },
  ];

  horrorBooks: Book[] = [
    { title: 'Чёрный кот', read: false }
  ];

  novelBooks: Book[] = [
    { title: 'Дориан Грей', read: false },
    { title: 'Мастер и Маргарита', read: false }
  ];

  historyBooks: Book[] = [
    { title: 'Библия', read: false }
  ];

  unpublishedBooks: Book[] = [
    { title: 'Лор Атласа', read: false },
    { title: 'Бронзовая медь', read: false }
  ];

  ngOnInit() {
    this.loadBooksState();
  }

  selectTab(tab: string) {
    this.activeTab = tab;
  }

  updateReadStatus(book: Book) {
    console.log(`${book.title} is now ${book.read ? 'read' : 'unread'}`);
    this.saveBooksState();
  }

  // Сохраняем состояние всех книг в localStorage
  saveBooksState() {
    const booksState = {
      fantasyBooks: this.fantasyBooks,
      detectiveBooks: this.detectiveBooks,
      sciFiBooks: this.sciFiBooks,
      horrorBooks: this.horrorBooks,
      novelBooks: this.novelBooks,
      historyBooks: this.historyBooks,
      unpublishedBooks: this.unpublishedBooks,
    };
    localStorage.setItem('booksState', JSON.stringify(booksState));
  }

  // Загружаем состояние книг из localStorage
  loadBooksState() {
    const savedState = localStorage.getItem('booksState');
    if (savedState) {
      const booksState = JSON.parse(savedState);
      this.fantasyBooks = booksState.fantasyBooks;
      this.detectiveBooks = booksState.detectiveBooks;
      this.sciFiBooks = booksState.sciFiBooks;
      this.horrorBooks = booksState.horrorBooks;
      this.novelBooks = booksState.novelBooks;
      this.historyBooks = booksState.historyBooks;
      this.unpublishedBooks = booksState.unpublishedBooks;
    }
  }
}
