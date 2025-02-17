import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';

@Component({
  selector: 'app-ilusha',
  templateUrl: './ilusha.component.html',
})
export class IlushaComponent implements OnInit {
  @ViewChild('editableDiv', { static: true }) editableDiv!: ElementRef;

  ngOnInit() {
    const savedText = localStorage.getItem('savedText');
    if (savedText) {
      this.editableDiv.nativeElement.innerText = savedText;
    }
  }

  handleKeyUp(event: KeyboardEvent) {
    event.preventDefault();
    const newText = this.editableDiv.nativeElement.innerText.trim();
    localStorage.setItem('savedText', newText);
  }
}
