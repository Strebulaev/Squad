import { Component, OnInit } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-countdown',
  templateUrl: './countdown.component.html',
  styleUrls: ['./countdown.component.css'],
  animations: [
    trigger('countdownAnimation', [
      state(
        'zoom',
        style({
          transform: 'scale(1)',
          color: '#000'
        })
      ),
      transition('* <=> *', [
        animate(
          '1s',
          style({
            transform: 'scale(1.2)',
            color: '#ff6f00'
          })
        )
      ])
    ])
  ]
})
export class CountdownComponent implements OnInit {
  days = 0;
  hours = 0;
  minutes = 0;
  seconds = 0;
  countdownFinished = false;

  constructor() { }

  ngOnInit(): void {
    this.updateCountdown();
    setInterval(() => {
      this.updateCountdown();
    }, 1000);
  }

  updateCountdown(): void {
    const targetDate = new Date('March 17, 2024 23:00:00').getTime();
    const now = new Date().getTime();
    const difference = targetDate - now;

    if (difference > 0) {
      let remainingTime = difference;

      this.days = Math.floor(remainingTime / (1000 * 60 * 60 * 24));
      remainingTime -= this.days * (1000 * 60 * 60 * 24);

      this.hours = Math.floor(remainingTime / (1000 * 60 * 60));
      remainingTime -= this.hours * (1000 * 60 * 60);

      this.minutes = Math.floor(remainingTime / (1000 * 60));
      remainingTime -= this.minutes * (1000 * 60);

      this.seconds = Math.floor(remainingTime / 1000);

      this.countdownFinished = false;
    } else {
      this.days = 0;
      this.hours = 0;
      this.minutes = 0;
      this.seconds = 0;
      this.countdownFinished = true;
    }
  }

}
