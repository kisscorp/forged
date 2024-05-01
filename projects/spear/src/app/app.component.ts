import { Component, OnInit, EventEmitter, Output, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { AuthFacade } from '@rollthecloudinc/auth';
import { Router } from '@angular/router';
import { PublicApiBridgeService } from '@rollthecloudinc/bridge';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { ZeffyDialogDialog } from './components/zeffy-dialog/zeffy-dialog.component';

declare var bridge: PublicApiBridgeService;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Spearhead Docs';
  // user$: Observable<User>;
  isAuthenticated: boolean;
  @Output()
  menuClicked = new EventEmitter();
  constructor(
    @Inject(PLATFORM_ID) platformId: Object,
    private authFacade: AuthFacade, 
    private router: Router,
    public dialog: MatDialog,
    publicApiBridge: PublicApiBridgeService
  ) {
    if (isPlatformBrowser(platformId)) {
      bridge = publicApiBridge;
    }
    /*this.oktaAuth.$authenticationState.subscribe(
      (isAuthenticated: boolean)  => this.isAuthenticated = isAuthenticated
    );*/
  }
  ngOnInit() {
    this.authFacade.getUser$.subscribe(u => {
      this.isAuthenticated = !!u;
    });
    /*this.oktaAuth.isAuthenticated().then((value) => {
      this.isAuthenticated = value;
    });*/
  }

  login() {
    this.authFacade.login();
    // this.oktaAuth.loginRedirect();
  }

  menuClick() {
    this.menuClicked.emit();
  }

  openZeffy() {
    // #docregion focus-restoration
    const dialogRef = this.dialog.open(ZeffyDialogDialog, {restoreFocus: false});

    // Manually restore focus to the menu trigger since the element that
    // opens the dialog won't be in the DOM any more when the dialog closes.
    // dialogRef.afterClosed().subscribe(() => this.menuTrigger.focus());
    // #enddocregion focus-restoration
  }

}
