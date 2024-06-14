import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from 'src/app/core/services/cart.service';
import { Product } from 'src/app/modules/product/model';
import { MENU } from 'src/app/shared/constant';
import { AuthService } from 'src/app/shared/services/auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: [
    `
    .top-nav-menu,
    .bottom-nav-menu {
      display:flex;
      align-items:center;
      gap:5px;
    }
    .top-nav-menu-item a,
    .top-nav-menu-item button {
      display:flex;
      justify-content:center;
      align-items:center;
      gap:4px;
      font-size:1.3rem;
      text-transform:uppercase;
      transition:all 0.5s;
    }
    .bottom-nav-menu-item a:hover {
      font-weight:600;
      border-bottom:4px solid #374151;
    }
    .active-link {
      font-weight:600;
      border-bottom:4px solid #374151;
    }
    `
  ]
})
export class HeaderComponent implements OnInit {
  cart: Product[] = [];
  menulist: { title: string; path: string }[] = MENU;
  isMenu = false;
  userPoints: number = 0;

  constructor(private cartService: CartService, public authService: AuthService,  private router:Router) {}

  openMenu() {
    this.isMenu = true;
  }

  closeMenu() {
    this.isMenu = false;
  }

  // logOut() {
  //   this.authService.logout();
  // }
  logOut() {
    localStorage.removeItem('userconnect');
    localStorage.removeItem('state');
    localStorage.removeItem('token');
    localStorage.removeItem('point');
    this.router.navigate(['/']); // Redirect to home or login page after logout
    window.location.reload(); // Reload the page after successful purchase

  }
  
  ngOnInit(): void {
    // this.getUserPoints();
    this.userPoints = JSON.parse(localStorage.getItem('point')!) || 0;


 
    this.cart = this.cartService.getCart;

        
  }

  // getUserPoints() {
  //   const user = JSON.parse(localStorage.getItem('userconnect')!);
  //   if (user) {
  //     this.userPoints = user.points || 0;
  //     console.log("this point user", this.userPoints);
  //   }

  // }

  // Method to update user points
  // updateUserPoints(points: number) {
  //   this.userPoints = points;
  // }
}
