import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { User } from 'src/app/services/user';
import { NewUserStoreService } from 'src/app/store/new-user-store.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = new Array<Subscription>();
  public userData!: User;

  constructor(
    private newUserStore: NewUserStoreService
  ) { }

  ngOnInit(): void {
    this.newUserStore.getUserData();
    this.subscriptions.push(
      this.newUserStore.userSubject$.subscribe((value) => {
        this.userData = value
      })
    )
  }

  public logOut = () => {
    this.newUserStore.logOut();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
