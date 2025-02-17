  import { Component, OnInit } from '@angular/core';
  import { HttpClient } from '@angular/common/http';

  @Component({
    selector: 'app-donat',
    templateUrl: './donat.component.html',
    styleUrls: ['./donat.component.css']
  })
  export class DonatComponent implements OnInit {
    comments: { author: string, body: string }[];
    newComment: { author: string, body: string };
    showComments: boolean;
    telegramBotToken: string;
    telegramChatId: string;

    constructor(private http: HttpClient) {
      this.comments = [];
      this.newComment = { author: '', body: '' };
      this.showComments = JSON.parse(localStorage.getItem('showComments') || 'false');
      this.telegramBotToken = '7039702625:AAFGyFbkG8_pSWv9HtKw1BEBvOcPwGl3bYQ';
      this.telegramChatId = '-1001822383897';
    }

    ngOnInit(): void {
      const savedComments = localStorage.getItem('comments');
      this.comments = savedComments ? JSON.parse(savedComments) : [];
      this.getTelegramMessages();
    }

    addComment(): void {
      if (this.newComment.author !== '' && this.newComment.body !== '') {
        const comment: { author: string, body: string } = {
          author: this.newComment.author,
          body: this.newComment.body
        };

        // Проверяем IP-адрес отправителя
        this.http.get('https://api.ipify.org?format=json').toPromise()
          .then((response: any) => {
            const clientIp = response.ip;

            if (this.isProfane(comment.body) && clientIp !== '62.217.191.135') {
              console.log('Недостаточно прав для отправки комментариев, уёбки конченые, все кроме максюши конечно.');
            } else {
              // Добавляем комментарий, если это не матерное слово или если отправитель имеет санкционированный IP-адрес
              this.comments.push(comment);
              this.saveCommentsToLocalStorage();
              this.sendCommentToTelegram(comment);
              this.newComment = { author: '', body: '' };
            }
          })
          .catch((error: any) => {
            console.error('Error getting client IP:', error);
          });
      }
    }

    private isProfane(text: string): boolean {
      const forbiddenRoots = ['ху', 'пизд', 'бля', 'еб', 'ёб', 'муд', 'дроч', 'говн', 'сук', 'шлю', 'мля', 'Ху', 'Пизд', 'Бля', 'Еб', 'Ёб', 'Муд', 'Дроч', 'Говн', 'Сук', 'Шлю', 'М ля'];

      const words = text.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '').split(' ');

      for (const word of words) {
        for (const root of forbiddenRoots) {
          if (word.includes(root)) {
            return true;
          }
        }
      }

      return false;
    }



    deleteComment(index: number): void {
      const deletedComment = this.comments.splice(index, 1)[0];
      this.saveCommentsToLocalStorage();

      this.deleteBotComment(deletedComment);
    }

    toggleComments(): void {
      this.showComments = !this.showComments;
      localStorage.setItem('showComments', JSON.stringify(this.showComments));
    }

    private saveCommentsToLocalStorage(): void {
      localStorage.setItem('comments', JSON.stringify(this.comments));
    }
    async deleteBotComment(comment: any) {
      const botUsername = "password170_bot";

      if (comment.author === botUsername && comment.body.includes(comment.body)) {
        try {
          await this.http.get<any>(`https://api.telegram.org/bot${this.telegramBotToken}/deleteMessage?chat_id=${this.telegramChatId}&message_id=${comment.message.message_id}`).toPromise();
          console.log('Bot comment deleted from Telegram');
        } catch (error) {
          console.error('Error deleting bot comment from Telegram:', error);
        }
      }
    }



    private async getTelegramMessages(): Promise<void> {
      try {
        const response = await this.http.get<any>(`https://api.telegram.org/bot${this.telegramBotToken}/getUpdates`).toPromise();
        const messages = response.result;

        messages.forEach((message: any) => {
          if (message.message && message.message.chat.type === 'group' &&
            message.message.chat.id.toString() === this.telegramChatId) {
            const author = message.message.from.username || message.message.from.first_name;
            const body = message.message.text;
            this.comments.push({ author, body });
          }
        });

        this.saveCommentsToLocalStorage();
      } catch (error) {
        console.error('Error getting Telegram messages:', error);
      }
    }

    private async sendCommentToTelegram(comment: { author: string, body: string }): Promise<void> {
      const message = `
      <strong>Автор:</strong> ${comment.author}
<strong>Комментарий:</strong> ${comment.body}
      `;

      try {
        await this.http.post<any>(`https://api.telegram.org/bot${this.telegramBotToken}/sendMessage`, {
          chat_id: this.telegramChatId,
          text: message,
          parse_mode: 'HTML'
        }).toPromise();
        console.log('Comment sent to Telegram');
      } catch (error) {
        console.error('Error sending comment to Telegram:', error);
      }
    }
  }
