import { Component,OnDestroy,OnInit } from '@angular/core';
import { Product } from 'src/app/modules/product/model';
import { CartService } from '../../services/cart.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/shared/services/auth/auth.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styles: [
    `
    /* hide scrollbar */
  ::-webkit-scrollbar {
    width: 0px;
  }
  ::-webkit-scrollbar-thumb {
    background: rgba(136, 136, 136, 0.281);
  }
  /* Handle on hover */
  ::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
    `
  ]
})
export class CartComponent implements OnInit, OnDestroy{
  cart:Product[]|any=[];
  total!:number;
  gstAmount!:number;
  estimatedTotal!:number;
  gstRate=0.18;
  shippingCost=0;
  subsTotal!:Subscription;
  subsGST!:Subscription;
  subsEstimatedTotal!:Subscription;
  totalPointsInCart: number = 0; // Declare a variable to hold the total points in the cart
  userPoints: number = 0; // Add this line

  constructor(private cartService:CartService,private router:Router,private authService: AuthService){}

  ngOnInit(): void {
    
    this.cartService.totalPoints.subscribe(totalPoints => {
      this.totalPointsInCart = totalPoints;
    });

    this.getCart();
    this.getTotal();
    this.calculateTotalPoints();
    this.getUserPoints(); // Add this line
  }
  calculateTotalPoints() {
    this.totalPointsInCart = 0;
    for (let product of this.cart) {
      this.totalPointsInCart += parseInt(product.pointProduct);
    }
  }

  getUserPoints() { // Add this function
    const user = JSON.parse(localStorage.getItem('userconnect')!);
    if (user) {
      this.userPoints = user.points || 0;
      console.log("this point user", this.userPoints);

    }
  }
  getCart(){
    this.cart=this.cartService.getCart;
  }
  getTotal(){
    this.total=this.cartService.getTotal();
    this.subsTotal=this.cartService.totalAmount.subscribe(data=>this.total=parseInt(data.toFixed(2)));
    this.subsGST=this.cartService.gstAmount.subscribe(data=>this.gstAmount=parseInt(data.toFixed(2)));
    this.subsEstimatedTotal=this.cartService.estimatedTotal.subscribe(data=>this.estimatedTotal=parseInt(data.toFixed(2)));
  }
  goToCheckout(){
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login'], { queryParams: { returnUrl: '/checkout' } });
      return;
    }
    console.log("grandTotal",this.cart.grandTotal);
    
    this.router.navigate(['/checkout'], {
      queryParams: {
        cart: JSON.stringify(this.cart),
        grandTotal: this.cart.grandTotal,
        pointsToUse:this.totalPointsInCart,
        
      }
      
    });  
    console.log("awwww",this.totalPointsInCart)

  }
  // hasEnoughPointsForProduct(): boolean {
  //   for (let product of this.cart) {
  //     // If points to use is greater than user points or less than product points required, return false
  //     if (this.pointsToUse > this.userPoints || this.pointsToUse < product.pointProduct) {
  //       return false;
  //     }
  //   }
  //   return true; // If all products are valid, return true
  // }


  unsubscribeSubject(){
    this.subsTotal.unsubscribe();
    this.subsGST.unsubscribe();
    this.subsEstimatedTotal.unsubscribe();
  }

  ngOnDestroy(): void {
    this.unsubscribeSubject();
  }
}
