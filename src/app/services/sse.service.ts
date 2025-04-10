// src/app/services/sse.service.ts
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SseService {
  private eventSource!: EventSource;

  getUpdates(): Observable<any> {
    return new Observable(observer => {
      this.eventSource = new EventSource('/api/sse');

      this.eventSource.onmessage = (event) => {
        observer.next(JSON.parse(event.data));
      };

      this.eventSource.onerror = (error) => {
        observer.error(error);
      };

      return () => {
        this.eventSource.close();
      };
    });
  }
}
