import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

interface TelegramUpdate {
  update_id: number;
  callback_query?: {
    data: string;
    message: {
      message_id: number;
      text: string;
    };
  };
}

interface TelegramResponse {
  ok: boolean;
  result?: any;
  description?: string;
}

@Injectable({ providedIn: 'root' })
export class TelegramService {
  private readonly BOT_TOKEN = '8181088924:AAFFumfMTW0j8qLzBq6Lwwv-bumI0804R-o';
  private readonly CHAT_ID = '670979713';
  private readonly API_URL = `https://api.telegram.org/bot${this.BOT_TOKEN}`;
  private pendingApprovals = new Map<number, boolean>();

  constructor(private http: HttpClient) {}

  sendTimerNotification(timer: Timer, type: 'new' | 'completed'): Observable<any> {
    const buttons = type === 'completed' ? [
      [{ text: "✅ Подтвердить", callback_data: `approve_${timer.id}` },
       { text: "❌ Отклонить", callback_data: `reject_${timer.id}` }]
    ] : [];

    const message = this.buildMessage(timer, type);

    return this.http.post(`${this.API_URL}/sendMessage`, {
      chat_id: this.CHAT_ID,
      text: message,
      parse_mode: 'HTML',
      reply_markup: buttons.length ? { inline_keyboard: buttons } : undefined
    }).pipe(
      catchError(error => {
        console.error('Telegram send error:', error);
        return throwError(() => new Error('Failed to send Telegram message'));
      })
    );
  }

  checkApprovals(): Observable<void> {
    return new Observable(subscriber => {
      this.http.get<TelegramResponse>(`${this.API_URL}/getUpdates`).subscribe({
        next: (response) => {
          if (response.ok && response.result) {
            this.processUpdates(response.result);
          }
          subscriber.next();
          subscriber.complete();
        },
        error: (err) => {
          subscriber.error(err);
        }
      });
    });
  }

  private processUpdates(updates: TelegramUpdate[]): void {
    updates.forEach(update => {
      if (update.callback_query) {
        const [action, timerId] = update.callback_query.data.split('_');
        this.pendingApprovals.set(parseInt(timerId), action === 'approve');
        this.removeReplyMarkup(update.callback_query.message.message_id).subscribe();
      }
    });
  }

  private removeReplyMarkup(messageId: number): Observable<any> {
    return this.http.post(`${this.API_URL}/editMessageReplyMarkup`, {
      chat_id: this.CHAT_ID,
      message_id: messageId,
      reply_markup: { inline_keyboard: [] }
    });
  }

  async sendTimerNotification(timer: any, type: 'new' | 'completed'): Promise<void> {
    const buttons = type === 'completed' ? [
      [{ text: "✅ Подтвердить", callback_data: `approve_${timer.id}` },
      { text: "❌ Отклонить", callback_data: `reject_${timer.id}` }]
    ] : [];

    const message = this.buildMessage(timer, type);

    try {
      await this.http.post(`${this.API_URL}/sendMessage`, {
        chat_id: this.CHAT_ID,
        text: message,
        parse_mode: 'HTML',
        reply_markup: buttons.length ? { inline_keyboard: buttons } : undefined
      }).toPromise();
    } catch (error) {
      console.error('Ошибка отправки в Telegram:', error);
      setTimeout(() => this.sendTimerNotification(timer, type), 5000);
    }
  }

  private buildMessage(timer: any, type: 'new' | 'completed'): string {
    if (type === 'new') {
      return `🚀 <b>Новая задача!</b>
        ▸ <i>${timer.task}</i>
        ▸ Время: ${timer.originalAmount} ${this.getUnitName(timer.originalUnit)}
        ▸ Сложность: ${timer.difficulty}🍪`;
    } else {
      return `📌 <b>Задача на проверку!</b>
        ▸ <i>${timer.task}</i>
        ▸ Осталось времени: ${timer.formattedTime}
        ▸ Сложность: ${timer.difficulty}🍪`;
    }
  }

  async checkApprovals(): Promise<void> {
    try {
      const response: any = await this.http.get(`${this.API_URL}/getUpdates`).toPromise();
      const updates: TelegramUpdate[] = response?.result || [];

      for (const update of updates) {
        if (update.callback_query) {
          const [action, timerId] = update.callback_query.data.split('_');
          this.pendingApprovals.set(parseInt(timerId), action === 'approve');

          await this.http.post(`${this.API_URL}/editMessageReplyMarkup`, {
            chat_id: this.CHAT_ID,
            message_id: update.callback_query.message.message_id,
            reply_markup: { inline_keyboard: [] }
          }).toPromise();
        }
      }
    } catch (error) {
      console.error('Ошибка проверки апрувов:', error);
    }
  }

  isApproved(timerId: number): boolean {
    return this.pendingApprovals.get(timerId) || false;
  }
    
  private getUnitName(unit: string): string {
    const units: { [key: string]: string } = {
      seconds: 'секунд',
      minutes: 'минут',
      hours: 'часов',
      days: 'дней'
    };
    return units[unit] || '';
  }
}
