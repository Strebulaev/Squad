import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { interval, Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TelegramService } from '../services/telegram.service';

interface Timer {
  id: number;
  task: string;
  difficulty: number;
  timeLeft: number;
  formattedTime: string;
  intervalId: ReturnType<typeof setInterval> | null;
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

interface SocketMessage {
  type: 'new_timer' | 'timer_approved' | 'timer_rejected' | 'admin_auth';
  timer?: Timer;
  timerId?: number;
  isAdmin?: boolean;
}

interface TimeUnit {
  value: string;
  name: string;
}

@Component({
  selector: 'app-crazy-timer',
  templateUrl: './crazy-timer.component.html',
  styleUrls: ['./crazy-timer.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule]
})
export class CrazyTimerComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  private socket$: WebSocketSubject<SocketMessage>;
  private approvalCheckSubscription?: Subscription;

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

  readonly units: TimeUnit[] = [
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

  constructor(
    private http: HttpClient,
    private telegram: TelegramService
  ) {
    this.socket$ = webSocket<SocketMessage>('ws://localhost:8080');
    this.setupWebSocket();
  }

  ngOnInit(): void {
    this.loadCookies();
    this.setupApprovalChecker();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.approvalCheckSubscription?.unsubscribe();
    this.clearAllIntervals();
    this.socket$.complete();
  }

  private setupWebSocket(): void {
    this.socket$.pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (message) => this.handleSocketMessage(message),
      error: (err) => console.error('WebSocket error:', err)
    });
  }

  private handleSocketMessage(message: SocketMessage): void {
    switch (message.type) {
      case 'new_timer':
        if (message.timer) this.addSharedTimer(message.timer);
        break;
      case 'timer_approved':
        if (message.timerId) this.handleApprovedTimer(message.timerId);
        break;
      case 'timer_rejected':
        if (message.timerId) this.handleRejectedTimer(message.timerId);
        break;
      case 'admin_auth':
        if (message.isAdmin !== undefined) this.isAdmin = message.isAdmin;
        break;
    }
  }

  private setupApprovalChecker(): void {
    this.approvalCheckSubscription = interval(3000).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: async () => {
        try {
          await this.telegram.checkApprovals();
          this.checkPendingApprovals();
        } catch (error) {
          console.error('Error checking approvals:', this.getErrorMessage(error));
        }
      },
      error: (err) => console.error('Approval check error:', err)
    });
  }

  private checkPendingApprovals(): void {
    this.pendingTimers.forEach(timer => {
      if (this.telegram.isApproved(timer.id)) {
        this.approveTask(timer.id);
      }
    });
  }

  private getErrorMessage(error: unknown): string {
    return error instanceof Error ? error.message : String(error);
  }

  addTimer(form: NgForm): void {
    if (!this.validateInput(form)) return;

    const newTimer = this.createNewTimer();
    this.startTimerInterval(newTimer);
    this.addTimerToActiveList(newTimer, form);
    this.telegram.sendTimerNotification(newTimer, 'new').subscribe();
  }

  private createNewTimer(): Timer {
    return {
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
  }

  private startTimerInterval(timer: Timer): void {
    timer.intervalId = setInterval(() => {
      this.updateTimer(timer);
    }, 1000);
  }

  private addTimerToActiveList(timer: Timer, form: NgForm): void {
    this.socket$.next({ type: 'new_timer', timer });
    this.activeTimers.push(timer);
    this.resetForm(form);
    this.checkSinisterMode();
  }

  completeTimer(timerId: number): void {
    const timerIndex = this.activeTimers.findIndex(t => t.id === timerId);
    if (timerIndex === -1) return;

    const timer = this.activeTimers[timerIndex];
    if (timer.intervalId) clearInterval(timer.intervalId);
    timer.isPending = true;

    this.activeTimers.splice(timerIndex, 1);
    this.pendingTimers.push(timer);
    this.telegram.sendTimerNotification(timer, 'completed').subscribe();
  }

  approveTask(timerId: number): void {
    const timerIndex = this.pendingTimers.findIndex(t => t.id === timerId);
    if (timerIndex === -1) return;

    const timer = this.pendingTimers[timerIndex];
    timer.isApproved = true;
    this.cookies += timer.difficulty;
    this.saveCookies();

    this.pendingTimers.splice(timerIndex, 1);
    this.completedTimers.push(timer);
  }

  rejectTask(timerId: number): void {
    const timerIndex = this.pendingTimers.findIndex(t => t.id === timerId);
    if (timerIndex === -1) return;

    const timer = this.pendingTimers[timerIndex];
    this.cookies = Math.max(0, this.cookies - timer.difficulty);
    this.saveCookies();
    this.pendingTimers.splice(timerIndex, 1);
  }

  private updateTimer(timer: Timer): void {
    timer.timeLeft--;
    timer.formattedTime = this.formatTime(timer.timeLeft);

    if (timer.timeLeft <= 0) {
      this.handleTimerExpiration(timer);
    }
  }

  private handleTimerExpiration(timer: Timer): void {
    if (timer.intervalId) clearInterval(timer.intervalId);
    this.isSinister = true;
    this.updateSinisterMessage();

    setTimeout(() => {
      this.activeTimers = this.activeTimers.filter(t => t.id !== timer.id);
      this.checkSinisterMode();
    }, 3000);
  }

  private loadCookies(): void {
    const savedCookies = localStorage.getItem('crazy-cookies');
    this.cookies = savedCookies ? parseInt(savedCookies) : 0;
  }

  private saveCookies(): void {
    localStorage.setItem('crazy-cookies', this.cookies.toString());
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
    const multipliers: Record<string, number> = {
      seconds: 1,
      minutes: 60,
      hours: 3600,
      days: 86400
    };
    return amount * (multipliers[unit] || 60);
  }

  private clearAllIntervals(): void {
    this.activeTimers.forEach(timer => {
      if (timer.intervalId) clearInterval(timer.intervalId);
    });
  }

  private checkSinisterMode(): void {
    this.isSinister = this.activeTimers.some(t => t.timeLeft <= 0);
    if (this.isSinister) {
      this.updateSinisterMessage();
    }
  }

  private updateSinisterMessage(): void {
    this.currentMessage = this.creepyMessages[
      Math.floor(Math.random() * this.creepyMessages.length)
    ];
  }

  getUnitName(unitValue: string): string {
    const unit = this.units.find(u => u.value === unitValue);
    return unit ? unit.name : '';
  }

  getPhotoStyle(index: number): Record<string, string> {
    const pos = this.photoPositions[index % this.photoPositions.length];
    return {
      'top': pos.top || '',
      'left': pos.left || '',
      'right': pos.right || '',
      'transform': `rotate(${pos.rotate}deg)${pos.y ? ` translateY(${pos.y}%)` : ''}`,
      'z-index': this.getRandomValue(1, 5).toString(),
      'animation': `photoFloat${index % 6 + 1} ${4 + index % 3}s ease-in-out infinite`
    };
  }

  getRandomValue(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  getRandomTransform(): string {
    return `rotate(${this.getRandomValue(-1, 1)}deg)`;
  }

  trackById(index: number, item: Timer): number {
    return item.id;
  }

  togglePhotoBoard(): void {
    this.showPhotoBoard = !this.showPhotoBoard;
  }
}
