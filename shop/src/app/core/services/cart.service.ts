import { Injectable } from '@angular/core';
import { Product } from 'src/app/modules/product/model';
import {BehaviorSubject} from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cart:Product[]=[];
  private products=new BehaviorSubject<Product[]>([]);
  public totalAmount=new BehaviorSubject<number>(0);
  public gstAmount=new BehaviorSubject<number>(0);
  public estimatedTotal=new BehaviorSubject<number>(0);
  public totalPointsSource=new BehaviorSubject<number>(0);
  totalPoints = this.totalPointsSource.asObservable(); // Added this line

  constructor( http:HttpClient) {
   }
  public get getCart(){
    return this.cart;
  }
  public add(product:Product){
    this.cart.push(product);
    this.updateQtyAndTotalPrice(product);
    this.products.next(this.cart);
  }

  public remove(product:Product){
    this.cart.map((prod:Product, index:number)=>{
      if(product._id=== prod._id){
        this.cart.splice(index,1);
      }
    })
    this.products.next(this.cart);
  }

  // updateQtyAndTotalPrice(item:Product){
  //   const index=this.find(item);
  //   const products=this.getCart;
  //   let totalQty=products[index].qty=1;
  //   totalQty=totalQty;
  //   let subTotal=products[index].price*totalQty;
  //   products[index].totalprice=subTotal;
  // }
  updateQtyAndTotalPrice(item: Product) {
    const index = this.find(item);
    const products = this.getCart;
    let totalQty = products[index].qty = 1;
    totalQty = totalQty;
  
    // Check if newprice is not 0, if so, use newprice, otherwise use price
    const priceToUse = products[index].newprice !== 0 ? products[index].newprice : products[index].price;
  
    let subTotal = priceToUse * totalQty;
    products[index].totalprice = subTotal;
  }
  
  find(item:Product):number{
    const products=this.getCart;
    const index= products.findIndex((prod)=>{ 
      return prod._id==item._id;
    })
    return index;
  }
  getTotal():number{
    const total=this.cart.reduce((r:any,c:any)=>r=r+c.totalprice,0);
    const gstRate=0.18;
    this.totalAmount.next(total);
    this.gstAmount.next(gstRate*total);
    this.estimatedTotal.next(total+this.gstAmount.value);
    return total;
  }
  // addQty(item:Product){
  //   const products=this.getCart;
  //   let index=this.find(item);
  //   let totalQty=products[index].qty;
  //   if(totalQty!==12){
  //     totalQty=totalQty&&totalQty+1;
  //   }
  //   products[index].qty=totalQty;
  //   let subTotal=products[index].price*totalQty!;
  //   products[index].totalprice=subTotal;
  //   this.updateTotalPoints(); // Update total points


  // }
  // lessQty(item:Product){
  //   const products=this.getCart;
  //   let index=this.find(item);
  //   let totalQty=products[index].qty;
  //   if(totalQty!==1){
  //     totalQty=totalQty&&totalQty-1;
  //   }
  //   products[index].qty=totalQty;
  //   let subTotal=products[index].price*totalQty!;
  //   products[index].totalprice=subTotal;
  //   this.updateTotalPoints(); // Update total points

  // }
  addQty(item: Product) {
    const products = this.getCart;
    const index = this.find(item);
    let totalQty = products[index].qty;
    
    if (totalQty !== 12) {
      totalQty = totalQty && totalQty + 1;
    }
    
    products[index].qty = totalQty;
    
    // Check if newprice is not 0, if so, use newprice, otherwise use price
    const priceToUse = products[index].newprice !== 0 ? products[index].newprice : products[index].price;
    
    const subTotal = priceToUse * totalQty!;
    products[index].totalprice = subTotal;
    
    this.updateTotalPoints(); // Update total points
  }
  
  lessQty(item: Product) {
    const products = this.getCart;
    const index = this.find(item);
    let totalQty = products[index].qty;
    
    if (totalQty !== 1) {
      totalQty = totalQty && totalQty - 1;
    }
    
    products[index].qty = totalQty;
    
    // Check if newprice is not 0, if so, use newprice, otherwise use price
    const priceToUse = products[index].newprice !== 0 ? products[index].newprice : products[index].price;
    
    const subTotal = priceToUse * totalQty!;
    products[index].totalprice = subTotal;
    
    this.updateTotalPoints(); // Update total points
  }
  

  getTotalPoints(): number {
    const totalPoints = this.cart.reduce((total, item) => {
        if (item.qty !== undefined) {
            return total + (item.pointProduct * item.qty);
        } else {
            return total;
        }
    }, 0);
    return totalPoints;
}

updateTotalPoints(): void {
  const totalPoints = this.cart.reduce((total, item) => {
      if (item.qty !== undefined) {
          return total + (item.pointProduct * item.qty);
      } else {
          return total;
      }
  }, 0);
  this.totalPointsSource.next(totalPoints);
}

}
