import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
@Component({
  selector: 'app-tab',
  templateUrl: './tab.component.html',
  styleUrls: ['./tab.component.css']
})
export class TabComponent implements OnInit {
  @ViewChild('editableDiv', { static: true }) editableDiv!: ElementRef;

  ngOnInit() {
    const savedTextTab = localStorage.getItem('savedTextTab');
    if (savedTextTab) {
      this.editableDiv.nativeElement.innerText = savedTextTab;
    }
  }

  handleKeyUpTab(event: KeyboardEvent) {
    event.preventDefault();
    const newText = this.editableDiv.nativeElement.innerText.trim();
    localStorage.setItem('savedTextTab', newText);
  }

}

