import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable, catchError, map, throwError} from 'rxjs';
import { Product} from '../model';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class ProductService {
  private apiUrl = 'http://localhost:3000/cards/all'; // Replace with your actual API URL
  apiUrlitem = 'http://localhost:3000/cards/items'; // Replace with your actual API endpoint

  private url='http://localhost:3000/client/products' ;
  products=new BehaviorSubject<Product[]>([]);
  ratingList:boolean[]=[];
  constructor(private http:HttpClient) { }

  get get():Observable<Product[]|any>{
    return this.http.get<{[key:string]:Product}>(this.url).pipe(map((data)=>{
      let newProducts:Product[]=[];
      for(const key in data){
        newProducts.push({...data[key]})
      }
      return newProducts;
    }),
    catchError((error)=>{
      return throwError(error); //throwError is deprecated
      // return new Error(error);
    }));
  }
  getByCategory(category:string):Observable<Product[]|any>{
    return this.http.get(this.url,{
      params:new HttpParams().set('category',category)
    });
  }
  getRelated(type:string):Observable<Product[]|any>{
    return this.http.get(this.url,{
      params:new HttpParams().set('type',type)
    });
  }
  getProduct(id:number):Observable<Product>{
    return this.http.get<Product>('http://localhost:3000/client/cc/'+id);
  }
  getAllProduct(): Observable<any> {
    return this.http.get<any>('http://localhost:3000/client/products');
  }
  search(query:string):Observable<Product[]>{
    return this.http.get<Product[]>(this.url,{
      params:new HttpParams().set('q',query)
    });
  }
  getRatingStar(product:Product){
    this.ratingList=[];
    [...Array(5)].map((_,index)=>{
      return index+1<= Math.trunc(product?.rating.rate)?this.ratingList.push(true):this.ratingList.push(false);
    });
    return this.ratingList;
  }
  getAllProducts(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }


    // GET all items
    getItems(): Observable<any[]> {
      return this.http.get<any[]>(this.apiUrlitem);
    }
}
