import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';



@Component({
  selector: 'app-fanarts',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './fanarts.component.html',
  styleUrls: ['./fanarts.component.css']
})
export class FanartsComponent {
  selectedTab: number = 1;
  characters: any[] = [
    { name: 'Это майнкрафтер', imageUrl: '/assets/images/5orka.jpg' },
    { name: 'Аль-Хайтам', imageUrl: '/assets/images/alhaitam.jpg' },
    { name: 'Дехья', imageUrl: '/assets/images/dehyia.jpg' },
  ];

  fanarts: any[] = [
    { title: 'Кавех', imageUrl: '/assets/images/kaveh.jpg' },
    { title: 'Дебора мейби твоя мать', imageUrl: '/assets/images/os.jpg' },
    { title: 'Кафка', imageUrl: '/assets/images/kafka.jpg' },
  ];
  viewDetails(item: any) {
    console.log("Просмотр подробностей: ", item);
  }
  changeTab(tabNumber: number) {
    this.selectedTab = tabNumber;
  }

}
