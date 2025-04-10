import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SseService {
  getUpdates(): Observable<any> {
    return new Observable(observer => {
      const eventSource = new EventSource('https://sq170.vercel.app/api/sse', {
        withCredentials: false
      });

      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          observer.next(data);
        } catch (e) {
          console.error('Error parsing SSE data', e);
        }
      };

      eventSource.onerror = (error) => {
        console.error('SSE error:', error);
        observer.error(error);
        eventSource.close();
      };

      return () => {
        eventSource.close();
      };
    });
  }
}
