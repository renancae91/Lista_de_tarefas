import { Component, signal } from '@angular/core';
import { InputAddItemComponent } from '../../components/input-add-item/input-add-item.component';
import { IListItem } from '../../interfaces/IListItem.interface';
import { InputListItemComponent } from '../../components/input-list-item/input-list-item.component';
import { retry } from 'rxjs';
import { ELocalStorage } from '../../Enum/ELocalStorage.enum';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [InputAddItemComponent, InputListItemComponent],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class ListComponent {
  public addItem = signal(true);

  #setListItem = signal<IListItem[]>(this.#parseItem());
  public getListItem = this.#setListItem.asReadonly();

  #parseItem() {
    return JSON.parse(localStorage.getItem(ELocalStorage.MY_LIST) || '[]')
  }
  #updateLocalSorage() {
    return localStorage.setItem(ELocalStorage.MY_LIST, JSON.stringify(this.#setListItem()));

  }

  public getInputAndAddItem(value: IListItem) {
    localStorage.setItem(ELocalStorage.MY_LIST, JSON.stringify([...this.#setListItem(), value]));
    return this.#setListItem.set(this.#parseItem());
  }
  public ListItensStage(value: 'pending' | 'completed') {
    return this.getListItem().filter((res: IListItem) => {
      if (value === 'pending') {
        return !res.checked;
      }
      if (value === 'completed') {
        return res.checked;
      }
      return res;
    });
  }
  public updateItemCheckBox(newItem: { checked: boolean; id: string }) {
    this.#setListItem.update((oldValue: IListItem[]) => {
      oldValue.filter((res) => {
        if (res.id === newItem.id) {
          res.checked = newItem.checked;
          return res;
        }
        return res;
      });
      return oldValue;
    });
    return this.#updateLocalSorage();
  }
  public updateItemText(newItem: { value: string; id: string }) {
    this.#setListItem.update((oldValue: IListItem[]) => {
      oldValue.filter((res) => {
        if (res.id === newItem.id) {
          res.value = newItem.value;
          return res;
        }
        return res;
      });
      return oldValue;
    });
    return this.#updateLocalSorage();
  }
  public deleteItem(id: string) {
    this.#setListItem.update((oldValue: IListItem[]) => {
      return oldValue.filter((res) => res.id !== id)
    })
    return this.#updateLocalSorage();

  }
  public deleteAllItems() {
    Swal.fire({
      title: 'Tem certeza?',
      text: 'Você não poderá reverter isso!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim, delete tudo',
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem(ELocalStorage.MY_LIST);
        return this.#setListItem.set(this.#parseItem());
      }
    });
  }
}
