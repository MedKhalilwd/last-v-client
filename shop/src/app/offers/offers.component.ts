import { Component, OnDestroy, OnInit } from '@angular/core';
import { Product } from '../modules/product/model';
import { BehaviorSubject, Subscription } from 'rxjs';
import { ProductService } from '../modules/product/services/product.service';
import { ActivatedRoute, Params } from '@angular/router';
import { FilterService } from '../modules/product/services/filter.service';

@Component({
  selector: 'app-offers',
  templateUrl: './offers.component.html',
  styleUrls: ['./offers.component.scss']
})
export class OffersComponent implements OnInit, OnDestroy{
  cloneOfProducts: Product[] = [];
  products: Product[] = [];
  category = '';
  isLoading = false;
  isFilter=false;
  error!:string;
  subsFilterProducts!:Subscription;
  
  selectedFilter:{rating:BehaviorSubject<number|null>;categoryId:BehaviorSubject<number|null>}={
    rating:new BehaviorSubject<number|null>(null),
    categoryId:new BehaviorSubject<number|null>(null)
  }
  ratingList:boolean[]=[];

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private filterService: FilterService
  ) {}

  ngOnInit(): void {
    this.getProductsByCategory();
    this.handleFilter();
  }

  getProductsByCategory(): Product[] {
    this.isLoading = true;
    this.route.params.subscribe((data: Params) => {
      this.category = data['category'];
      this.ratingList=[false,false,false,false];
      this.resetFilter();
      this.productService.getByCategory(this.category).subscribe((data)=>{
        this.isLoading = false;
        this.products = data.filter((el:any) => el.isOffer == true)
        console.log("liste product : ",this.products);
        this.cloneOfProducts=data;        
        this.filterService.filterProduct(data);
      },
      (error)=>this.error=error.message
      );
      this.filterService.getProductTypeFilter(this.category);
    });

    return this.products;
  }
  // handleFilter() {
  //   this.subsFilterProducts=this.filterService.filteredProducts.subscribe((data) => {
  //     this.products = data
  //   });
  // }
  handleFilter() {
    this.subsFilterProducts = this.filterService.filteredProducts.subscribe((data) => {
      this.products = data.filter((el: any) => el.isOffer == true); // Apply the filter here
    });
  }
  
  onFilter(value:boolean){
    this.isFilter=value;
  }

  resetFilter(){
    this.selectedFilter.categoryId.next(null);
    this.selectedFilter.rating.next(null);
  }
  

  ngOnDestroy(): void {
    this.subsFilterProducts.unsubscribe();
  }
}
