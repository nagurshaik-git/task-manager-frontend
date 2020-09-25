import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit, OnDestroy {

  isLoggedIn: boolean;
  userSub: Subscription;

  constructor(
    private authService: AuthService) { }

  ngOnInit(): void {
    this.initAuth();
  }

  ngOnDestroy(): void {
    if (this.userSub) {
      this.userSub.unsubscribe();
    }
  }

  logout(): void {
    const logoutSub = this.authService.logout$().subscribe(() => {
      this.isLoggedIn = false;
    });
    this.userSub.add(logoutSub);
  }

  private initAuth(): void {
    this.userSub = this.authService.userSubject.subscribe(user => {
      if (user && user.token) {
        return this.isLoggedIn = true;
      }

      this.isLoggedIn = false;
    });
  }

}
