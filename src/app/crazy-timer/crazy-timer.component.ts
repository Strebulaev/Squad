import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { HttpClientModule } from '@angular/common/http';

interface Timer {
  id: number;
  task: string;
  difficulty: number;
  timeLeft: number;
  formattedTime: string;
  intervalId: any;
  originalAmount: number;
  originalUnit: string;
  completed: boolean;
  elementStyle: {
    transform: string;
    'z-index': number;
  };
  isApproved?: boolean;
  isPending?: boolean;
}

@Component({
  selector: 'app-crazy-timer',
  templateUrl: './crazy-timer.component.html',
  styleUrls: ['./crazy-timer.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule] // Добавьте HttpClientModule
})
export class CrazyTimerComponent implements OnInit, OnDestroy {
  private readonly TELEGRAM_BOT_TOKEN = '8181088924:AAFFumfMTW0j8qLzBq6Lwwv-bumI0804R-o';
  private readonly TELEGRAM_CHAT_ID = '670979713';
  private socket$: WebSocketSubject<any>;

  cookies: number = 0;
  activeTimers: Timer[] = [];
  completedTimers: Timer[] = [];
  pendingTimers: Timer[] = [];
  newTask: string = '';
  timeAmount: number = 1;
  selectedUnit: string = 'minutes';
  difficulty: number = 0;
  isSinister: boolean = false;
  nextId: number = 1;
  currentMessage: string = '';
  showPhotoBoard: boolean = true;
  isAdmin: boolean = false;

  photos: string[] = Array.from({ length: 17 }, (_, i) => `assets/Timer/sticker${i + 1}.png`);

  readonly creepyMessages: string[] = [
    'ТЫ НИЧТОЖЕН',
    'ЧЁРНАЯ МРАЗЬ',
    'НЕУДАЧНИК!',
    'ТЫ НИ НА ЧТО НЕ СПОСОБЕН!',
    'ПОЗОРОРИЩЕ!',
    'ПОСЛЕДНЯЯ СВОЛОЧЬ!',
    'БЕСПОМОЩНАЯ ЧЕРНЬ!',
    'ПЛЕБЕЙ!'
  ];

  readonly units: { value: string, name: string }[] = [
    { value: 'seconds', name: 'Секунд' },
    { value: 'minutes', name: 'Минут' },
    { value: 'hours', name: 'Часов' },
    { value: 'days', name: 'Дней' }
  ];

  private photoPositions = [
    { top: '5%', left: '5%', rotate: -12 },
    { top: '5%', right: '5%', rotate: 15 },
    { bottom: '5%', left: '5%', rotate: 8 },
    { bottom: '5%', right: '5%', rotate: -18 },
    { top: '50%', left: '3%', rotate: -5, y: -50 },
    { top: '50%', right: '3%', rotate: 10, y: -50 },
    { top: '10%', left: '20%', rotate: -8 },
    { top: '10%', left: '40%', rotate: 5 },
    { top: '10%', right: '20%', rotate: -5 },
    { top: '10%', right: '40%', rotate: 12 },
    { bottom: '10%', left: '20%', rotate: 7 },
    { bottom: '10%', left: '40%', rotate: -10 },
    { bottom: '10%', right: '20%', rotate: 15 },
    { bottom: '10%', right: '40%', rotate: -7 },
    { top: '30%', left: '15%', rotate: -3 },
    { top: '30%', right: '15%', rotate: 7 },
    { top: '70%', left: '25%', rotate: 5 },
    { top: '70%', right: '25%', rotate: -9 }
  ];

  constructor(private http: HttpClient) {
    this.socket$ = webSocket('ws://localhost:8080');

    this.socket$.subscribe({
      next: (message) => {
        switch (message.type) {
          case 'new_timer':
            this.addSharedTimer(message.timer);
            break;
          case 'timer_approved':
            this.handleApprovedTimer(message.timerId);
            break;
          case 'timer_rejected':
            this.handleRejectedTimer(message.timerId);
            break;
          case 'timer_completed':
            this.handleCompletedTimer(message.timer);
            break;
          case 'admin_auth':
            this.isAdmin = message.isAdmin;
            break;
        }
      },
      error: (err) => console.error('WebSocket error:', err)
    });
  }

  ngOnInit(): void {
    this.loadCookies();
    this.checkSinisterMode();
    this.checkAdminStatus();
  }

  ngOnDestroy() {
    this.socket$.complete();
    this.clearAllIntervals();
  }

  private checkAdminStatus(): void {
    const urlParams = new URLSearchParams(window.location.search);
    this.isAdmin = urlParams.has('admin');
  }

  private loadCookies(): void {
    const savedCookies = localStorage.getItem('crazy-cookies');
    this.cookies = savedCookies ? parseInt(savedCookies) : 0;
  }

  private saveCookies(): void {
    localStorage.setItem('crazy-cookies', this.cookies.toString());
  }

  private sendTelegramNotification(message: string, timerId: number): void {
    const url = `https://api.telegram.org/bot${this.TELEGRAM_BOT_TOKEN}/sendMessage`;
    const payload = {
      chat_id: this.TELEGRAM_CHAT_ID,
      text: message,
      parse_mode: 'HTML',
      reply_markup: {
        inline_keyboard: [
          [
            { text: "✅ Подтвердить", callback_data: `approve_${timerId}` },
            { text: "❌ Отклонить", callback_data: `reject_${timerId}` }
          ]
        ]
      }
    };

    this.http.post(url, payload).subscribe({
      next: () => console.log('Уведомление отправлено в Telegram'),
      error: (err) => console.error('Ошибка отправки:', err)
    });
  }

  addTimer(form: NgForm): void {
    if (!this.validateInput(form)) return;

    const newTimer: Timer = {
      id: this.nextId++,
      task: this.newTask.trim(),
      difficulty: this.difficulty,
      timeLeft: this.convertToSeconds(this.timeAmount, this.selectedUnit),
      formattedTime: this.formatTime(this.convertToSeconds(this.timeAmount, this.selectedUnit)),
      intervalId: null,
      originalAmount: this.timeAmount,
      originalUnit: this.selectedUnit,
      completed: false,
      elementStyle: {
        transform: `rotate(${this.getRandomValue(-5, 5)}deg)`,
        'z-index': this.getRandomValue(1, 10)
      }
    };

    newTimer.intervalId = setInterval(() => {
      this.updateTimer(newTimer);
    }, 1000);

    this.socket$.next({
      type: 'new_timer',
      timer: newTimer
    });

    this.activeTimers.push(newTimer);
    this.resetForm(form);
    this.checkSinisterMode();

    this.sendTelegramNotification(`
      🚀 <b>Новая задача!</b>
      ▸ <i>${newTimer.task}</i>
      ▸ Время: ${newTimer.originalAmount} ${this.getUnitName(newTimer.originalUnit)}
      ▸ Сложность: ${newTimer.difficulty}🍪
    `, newTimer.id);
  }

  private updateTimer(timer: Timer): void {
    timer.timeLeft--;
    timer.formattedTime = this.formatTime(timer.timeLeft);

    if (timer.timeLeft <= 0) {
      this.handleTimerExpiration(timer);
    }
  }

  completeTimer(timerId: number): void {
    const timerIndex = this.activeTimers.findIndex(t => t.id === timerId);
    if (timerIndex === -1) return;

    const timer = this.activeTimers[timerIndex];
    clearInterval(timer.intervalId);
    timer.isPending = true;

    this.socket$.next({
      type: 'timer_completed',
      timer: timer
    });

    this.activeTimers.splice(timerIndex, 1);
    this.pendingTimers.push(timer);

    this.sendTelegramNotification(`
      📌 <b>Задача на проверку!</b>
      ▸ <i>${timer.task}</i>
      ▸ Осталось времени: ${timer.formattedTime}
      ▸ Сложность: ${timer.difficulty}🍪
    `, timer.id);
  }

  approveTask(timerId: number): void {
    console.log(`Starting approve for timer ${timerId}`);

    let timerIndex = this.pendingTimers.findIndex(t => t.id === timerId);
    let timer: Timer;

    if (timerIndex !== -1) {
      timer = this.pendingTimers[timerIndex];
      this.pendingTimers.splice(timerIndex, 1);
      console.log(`Timer ${timerId} found in pending timers`);
    } else {
      timerIndex = this.activeTimers.findIndex(t => t.id === timerId);
      if (timerIndex === -1) {
        console.error(`Timer ${timerId} not found in active or pending timers`);
        return;
      }
      timer = this.activeTimers[timerIndex];
      console.log(`Timer ${timerId} found in active timers`);
    }

    timer.isApproved = true;
    timer.isPending = false;
    this.cookies += timer.difficulty;
    this.saveCookies();
    this.completedTimers.push(timer);

    console.log(`Timer ${timerId} approved successfully`);

    this.socket$.next({
      type: 'timer_approved',
      timerId: timer.id
    });
  }

  rejectTask(timerId: number): void {
    const timerIndex = this.pendingTimers.findIndex(t => t.id === timerId);
    if (timerIndex === -1) return;

    const timer = this.pendingTimers[timerIndex];
    this.pendingTimers.splice(timerIndex, 1);
    this.cookies = Math.max(0, this.cookies - timer.difficulty);
    this.saveCookies();

    this.socket$.next({
      type: 'timer_rejected',
      timerId: timer.id
    });
  }

  private addSharedTimer(timerData: any): void {
    const newTimer: Timer = {
      ...timerData,
      intervalId: setInterval(() => {
        this.updateTimer(newTimer);
      }, 1000)
    };

    this.activeTimers.push(newTimer);
  }

  private handleCompletedTimer(timerData: any): void {
    const timerIndex = this.activeTimers.findIndex(t => t.id === timerData.id);
    if (timerIndex !== -1) {
      const timer = this.activeTimers[timerIndex];
      clearInterval(timer.intervalId);
      this.activeTimers.splice(timerIndex, 1);
      this.pendingTimers.push({ ...timer, isPending: true });
    }
  }

  private handleApprovedTimer(timerId: number): void {
    const timerIndex = this.pendingTimers.findIndex(t => t.id === timerId);
    if (timerIndex !== -1) {
      const timer = this.pendingTimers[timerIndex];
      timer.isApproved = true;
      timer.isPending = false;
      this.cookies += timer.difficulty;
      this.saveCookies();
      this.completedTimers.push(timer);
      this.pendingTimers.splice(timerIndex, 1);
    }
  }

  private handleRejectedTimer(timerId: number): void {
    const timerIndex = this.pendingTimers.findIndex(t => t.id === timerId);
    if (timerIndex !== -1) {
      const timer = this.pendingTimers[timerIndex];
      this.cookies = Math.max(0, this.cookies - timer.difficulty);
      this.saveCookies();
      this.pendingTimers.splice(timerIndex, 1);
    }
  }

  private handleTimerExpiration(timer: Timer): void {
    clearInterval(timer.intervalId);
    this.isSinister = true;
    this.updateSinisterMessage();

    setTimeout(() => {
      this.activeTimers = this.activeTimers.filter(t => t.id !== timer.id);
      this.checkSinisterMode();
    }, 3000);
  }

  private checkSinisterMode(): void {
    const hasExpiredTimers = this.activeTimers.some(t => t.timeLeft <= 0);
    this.isSinister = hasExpiredTimers;

    if (this.isSinister) {
      this.updateSinisterMessage();
    }
  }

  private updateSinisterMessage(): void {
    this.currentMessage = this.creepyMessages[
      Math.floor(Math.random() * this.creepyMessages.length)
    ];
  }

  private validateInput(form: NgForm): boolean {
    return !!(
      form.valid &&
      this.newTask.trim().length >= 3 &&
      this.timeAmount > 0 &&
      this.difficulty >= 0 &&
      this.difficulty <= 10
    );
  }

  private resetForm(form: NgForm): void {
    form.resetForm({
      timeAmount: 1,
      selectedUnit: 'minutes',
      difficulty: 0
    });
    this.newTask = '';
  }

  private formatTime(totalSeconds: number): string {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  private convertToSeconds(amount: number, unit: string): number {
    const multiplier = {
      'seconds': 1,
      'minutes': 60,
      'hours': 3600,
      'days': 86400
    }[unit] || 60;

    return amount * multiplier;
  }

  getUnitName(unitValue: string): string {
    const unit = this.units.find(u => u.value === unitValue);
    return unit ? unit.name : '';
  }

  private clearAllIntervals(): void {
    this.activeTimers.forEach(timer => {
      if (timer.intervalId) {
        clearInterval(timer.intervalId);
      }
    });
  }

  getPhotoStyle(index: number): any {
    const pos = this.photoPositions[index % this.photoPositions.length];
    return {
      'top': pos.top,
      'left': pos.left,
      'right': pos.right,
      'transform': `rotate(${pos.rotate}deg)${pos.y ? ` translateY(${pos.y}%)` : ''}`,
      'z-index': this.getRandomValue(1, 5),
      'animation': `photoFloat${index % 6 + 1} ${4 + index % 3}s ease-in-out infinite`
    };
  }

  getRandomValue(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  trackById(index: number, item: Timer): number {
    return item.id;
  }

  togglePhotoBoard(): void {
    this.showPhotoBoard = !this.showPhotoBoard;
  }

  handleTelegramCallback(update: any): void {
    console.log('Telegram callback received:', update); // Логируем входящий callback

    if (!update.callback_query) {
      console.warn('No callback_query in update');
      return;
    }

    const data = update.callback_query.data;
    const timerId = parseInt(data.split('_')[1]);
    const messageId = update.callback_query.message.message_id;

    console.log(`Processing action: ${data}, timerId: ${timerId}`);

    if (data.startsWith('approve')) {
      this.approveTask(timerId);
      console.log(`Approved task ${timerId}`);
    } else if (data.startsWith('reject')) {
      this.rejectTask(timerId);
      console.log(`Rejected task ${timerId}`);
    } else {
      console.warn(`Unknown action: ${data}`);
    }

    // Удаляем кнопки после нажатия
    const editUrl = `https://api.telegram.org/bot${this.TELEGRAM_BOT_TOKEN}/editMessageReplyMarkup`;
    this.http.post(editUrl, {
      chat_id: this.TELEGRAM_CHAT_ID,
      message_id: messageId,
      reply_markup: { inline_keyboard: [] }
    }).subscribe({
      next: () => console.log('Buttons removed successfully'),
      error: (err) => console.error('Error removing buttons:', err)
    });
  }
}
