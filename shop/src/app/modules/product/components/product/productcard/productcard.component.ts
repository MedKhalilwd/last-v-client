import { Component,Input,OnInit } from '@angular/core';
import { Product } from '../../../model';
import { CartService } from 'src/app/core/services/cart.service';
import { ProductService } from '../../../services/product.service';
import { Router,NavigationEnd } from '@angular/router';
import { ViewportScroller } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-productcard',
  templateUrl: './productcard.component.html',
  styles: [
  ]
})
export class ProductcardComponent implements OnInit  {
  @Input() product!:Product;
  ratingList!:boolean[];
  cart:Product[]=[];
  isProductPresent:boolean=this.cart.some(item=>item._id==this.product._id);
  discount=0;
  imageUrl = '';

  constructor(private cartService:CartService, private productService:ProductService){}

  ngOnInit(): void {
    this.cart=this.cartService.getCart;
    this.discount=this.product&&Math.round(100-(this.product.price/this.product.prevprice)*100);
    this.getRatingStar();
    this.imageUrl = this.constructImageUrl(this.product.images[0]);

    console.log(this.product);
    
  }


  constructImageUrl(imagePath: string): string {
    const baseUrl = 'http://localhost:3000/multiplefiles'; // Change this to your server's base URL
    return `${baseUrl}/${encodeURIComponent(imagePath)}`;
  }
  addToCart(product: Product){
    this.cartService.add(product);
 }

  removeFromCart(product:Product){
    this.cartService.remove(product);    
  }

  isProductInCart(product:Product){
    return this.cart.some(item=>item._id==product._id);
    
  }
  
  getRatingStar(){ 
    this.ratingList=this.productService.getRatingStar(this.product);
  }

}
