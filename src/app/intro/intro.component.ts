import { Component, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router'; // Импортируйте Router

@Component({
  selector: 'app-intro',
  templateUrl: './intro.component.html',
  styleUrls: ['./intro.component.css'],
})
export class IntroComponent {
  showIntro: boolean = true;
  isVideoPlaying: boolean = false;
  @ViewChild('introVideo') introVideo!: ElementRef<HTMLVideoElement>;

  constructor(private router: Router) { } // Добавьте Router в конструктор

  // Запуск видео
  startVideo(): void {
    this.isVideoPlaying = true;
    setTimeout(() => {
      if (this.introVideo && this.introVideo.nativeElement) {
        this.introVideo.nativeElement.play();
      }
    }, 0);
  }

  // Обработчик завершения видео
  onVideoEnd(): void {
    this.showIntro = false; // Скрываем заставку
    this.router.navigate(['/home/home']);
  }
}
