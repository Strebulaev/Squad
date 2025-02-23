import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VideoStateService {
  private videoEnded = new BehaviorSubject<boolean>(false);
  videoEnded$ = this.videoEnded.asObservable();

  setVideoEnded(value: boolean): void {
    this.videoEnded.next(value);
  }
}
