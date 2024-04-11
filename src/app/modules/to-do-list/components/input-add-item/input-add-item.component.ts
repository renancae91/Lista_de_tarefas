import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, Output, ViewChild, inject, viewChild } from '@angular/core';
import { IListItem } from '../../interfaces/IListItem.interface';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-input-add-item',
  standalone: true,
  imports: [NgClass],
  templateUrl: './input-add-item.component.html',
  styleUrl: './input-add-item.component.scss'
})
export class InputAddItemComponent {
  #cdr = inject(ChangeDetectorRef);

  @ViewChild("inputText") public inputText!: ElementRef;

  @Input({ required: true }) public inputListitems: IListItem[] = []
  @Output() public outputAddListItem = new EventEmitter<IListItem>()
  public focusAndAddItem(value: string) {
    if (value) {
      this.#cdr.detectChanges();
      this.inputText.nativeElement.value = '';
      const CurrentDate = new Date();
      const timesTemp = CurrentDate.getTime();
      const id = `ID ${timesTemp}`;

      this.outputAddListItem.emit({
        id,
        checked: false,
        value
      });

      return this.inputText.nativeElement.focus();
    }
  }
}
