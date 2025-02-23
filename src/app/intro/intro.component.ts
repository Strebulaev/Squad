import { Component, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-intro',
  templateUrl: './intro.component.html',
  styleUrls: ['./intro.component.css'],
})
export class IntroComponent {
  showIntro: boolean = true;
  isVideoPlaying: boolean = false;
  @ViewChild('introVideo') introVideo!: ElementRef<HTMLVideoElement>;

  // Запуск видео
  startVideo(): void {
    this.isVideoPlaying = true; // Показываем видео
    setTimeout(() => {
      if (this.introVideo && this.introVideo.nativeElement) {
        this.introVideo.nativeElement.play();
      }
    }, 0);
  }

  // Обработчик завершения видео
  onVideoEnd(): void {
    this.showIntro = false; // Скрываем заставку и показываем основной контент
  }
}
