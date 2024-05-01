import { Component, OnInit, EventEmitter, Output, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { AuthFacade } from '@rollthecloudinc/auth';
import { Router } from '@angular/router';
import { PublicApiBridgeService } from '@rollthecloudinc/bridge';

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
    this.wireZeffy();
  }

  login() {
    this.authFacade.login();
    // this.oktaAuth.loginRedirect();
  }

  menuClick() {
    this.menuClicked.emit();
  }

  private wireZeffy() {

      let e = "zeffy-form-link"
        , t = "zeffy-iframe"
        , i = "display: none; position: fixed; top: 0; bottom: 0; right: 0; left: 0; z-index: 10000; transition: opacity 0.25s ease-in-out; opacity: 0;";
      function a(e) {
          let t = new URL(e)
            , i = new URLSearchParams(t.search);
          return i.append("cachebust", Date.now() as any),
          t.search = i.toString(),
          t.toString()
      }
      let n = document.querySelectorAll('iframe[src^="https://www.zeffy.com/"], iframe[src^="https://app.simplyk.io/"]');
      n.forEach((e: any) =>{
          e.src = a(e.src)
      }
      );
      let o = document.querySelectorAll(`[${e}]`);
      if (o.length > 0) {
          let s = {};
          o.forEach(t=>{
              let i = t.getAttribute(e);
              i && (s[i] || (s[i] = []),
              s[i].push(t))
          }
          );
          let d: any = window.document.createElement("div");
          Object.assign(d, {
              style: "display: none; position: fixed; top: 0; bottom: 0; right: 0; left: 0; background-color: rgba(0,0,0,0.5); z-index: 10000; transition: opacity 0.25s ease-in-out; opacity: 0;",
              ariaHidden: "true"
          }),
          document.body.append(d),
          Object.keys(s).forEach(e=>{
              let n = window.document.createElement("div") as any;
              Object.assign(n, {
                  style: i,
                  ariaHidden: "true"
              });
              let o = window.document.createElement("iframe");
              Object.assign(o, {
                  title: "Form powered and secured by Zeffy",
                  style: "width: 100%; height: 100%; border: none; border-radius: 4px;",
                  src: a(e),
                  allow: "payment"
              }),
              n.append(o);
              let l = window.matchMedia("(min-width: 769px)");
              function r(e) {
                  e.matches ? (n.style.top = "5%",
                  n.style.bottom = "5%",
                  n.style.left = "10%",
                  n.style.right = "10%") : (n.style.top = 0,
                  n.style.bottom = 0,
                  n.style.left = 0,
                  n.style.right = 0)
              }
              function c() {
                  d.style.display = "block",
                  d.ariaHidden = "false",
                  n.style.display = "block",
                  n.ariaHidden = "false",
                  setTimeout(()=>{
                      d.style.opacity = 1,
                      n.style.opacity = 1
                  }
                  , 1)
              }
              function y() {
                  d.style.opacity = 0,
                  n.style.opacity = 0,
                  setTimeout(()=>{
                      d.style.display = "none",
                      d.ariaHidden = "true",
                      n.style.display = "none",
                      n.ariaHidden = "true"
                  }
                  , 250)
              }
              l.addEventListener("change", r),
              r(l),
              document.body.append(n),
              d.addEventListener("click", ()=>{
                  y()
              }
              ),
              s[e].forEach(e=>{
                  e.addEventListener("click", ()=>{
                      c(),
                      o.contentWindow.postMessage({
                          id: t,
                          open: !0
                      }, "*")
                  }
                  )
              }
              ),
              window.addEventListener("keydown", e=>{
                  "Escape" === e.key && y()
              }
              ),
              window.addEventListener("message", e=>{
                  e.isTrusted && e.data && e.data.id === t && e.data.close && y()
              }
              , !1)
          }
          )
      }
  }

}
