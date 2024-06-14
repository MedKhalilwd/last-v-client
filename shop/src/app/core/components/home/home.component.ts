import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Product } from 'src/app/modules/product/model';
import { ProductService } from 'src/app/modules/product/services/product.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styles: [`
  .hero-slider {
  position: relative;
  max-width: 100%;
  margin: auto;
  max-height: 450px;
}

.slider-button {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  cursor: pointer;
  padding: 10px;
  border-radius: 50%;
}

.slider-button.left {
  left: 10px;
}

.slider-button.right {
  right: 10px;
}

.section {
  padding: 20px;
}

.section-header {
  width: 100%;
  margin: 20px;
  text-align: center;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.899);
  border-radius: 10px;
  padding: 60px;
}

.product-carousel {
  overflow: hidden;
  position: relative;
  width: 100%;
  max-width: 100%;
  max-height: 600px;
  margin-bottom: 50px;
  margin-top: 50px;
}

.product-carousel-inner {
  display: flex;
  flex-wrap: nowrap;
  transition: transform 0.5s ease;
}

.prod {
  border: 1px solid #ddd;
  border-radius: 10px;
  padding: 10px;
  width: 300px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  text-align: center;
  flex: 0 0 auto;
  margin-right: 20px;
  max-height: 500px;
}

.prod:hover {
  padding: 10px;
  margin: 3px;
  background-color: #f1f1f1c2;
}

.product-image {
  height: 300px;
  object-fit: cover;
}

.product-title {
  font-size: 1.5em;
  margin: 10px 0;
  cursor: pointer;
}

.product-price,
.product-points {
  font-size: 1em;
  margin: 5px 0;
}

.carousel-button {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  cursor: pointer;
  padding: 10px;
  border-radius: 50%;
}

.carousel-button.left {
  left: 10px;
}

.carousel-button.right {
  right: 10px;
}


  `]
})
export class HomeComponent implements OnInit, OnDestroy {
  products: any[] = [];
  productsoffer: any[] = [];
  productsrecompense: any[] = [];

  images: string[] = [
    'assets/images/image.png',
    'assets/images/bb.png',
    'assets/images/logo.png',
  ];
  currentIndex = 0;
  userPoints: any;
  currentImageIndex = 0; 
  interval: any;
  productIntervals: any = {};

  productIndices: { [key: string]: number } = {
    'products': 0,
    'offers': 0,
    'recompenses': 0
  };

  items: any[] = [];

  constructor(
    private _productService: ProductService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getItems();
    this.startAutoSlide();
    this.startAutoProductSlide('products');
    this.startAutoProductSlide('offers');
    this.startAutoProductSlide('recompenses');

    const user = JSON.parse(localStorage.getItem('userconnect')!);
    if (user) {
      this.userPoints = user.points || 0;
      console.log("this point user", this.userPoints);
    }
    this.loadProducts();
    this.loadProductsOffers();
    this.loadProductsRecompenses();
  }

  getItems(): void {
    this._productService.getItems().subscribe(
      (res: any[]) => {
        this.items = res;
        this.images = this.items.map(item => item.image);
        console.log("Fetched items:", this.items);
      },
      err => {
        console.error("Error fetching items:", err);
      }
    );
  }

  ngOnDestroy(): void {
    clearInterval(this.interval);
    for (const key in this.productIntervals) {
      clearInterval(this.productIntervals[key]);
    }
  }

  startAutoSlide(): void {
    this.interval = setInterval(() => {
      this.nextSlide();
    }, 2000);
  }

  loadProducts(): void {
    this._productService.getAllProduct().subscribe({
      next: (data) => {
        this.products = data;
        console.log('Products loaded:', this.products);
      },
      error: (error) => {
        console.error('There was an error loading the products!', error);
      }
    });
  }

  loadProductsOffers(): void {
    this._productService.getAllProduct().subscribe({
      next: (data) => {
        this.productsoffer = data.filter((el: any) => el.isOffer == true);
        console.log('products offer loaded:', this.productsoffer);
      },
      error: (error) => {
        console.error('There was an error loading the products!', error);
      }
    });
  }

  loadProductsRecompenses(): void {
    this._productService.getAllProducts().subscribe({
      next: (data) => {
        this.productsrecompense = data;
        console.log('products recompense loaded:', this.productsrecompense);
      },
      error: (error) => {
        console.error('There was an error loading the products!', error);
      }
    });
  }

  prevSlide() {
    this.currentIndex = (this.currentIndex > 0) ? this.currentIndex - 1 : this.images.length - 1;
  }

  nextSlide() {
    this.currentIndex = (this.currentIndex < this.images.length - 1) ? this.currentIndex + 1 : 0;
  }

  goToProductDetails(product: any) {
    this.router.navigate(['/product', { product: JSON.stringify(product) }]);
    console.log("product", product);
  }

  startAutoProductSlide(listName: string): void {
    this.productIntervals[listName] = setInterval(() => {
      this.nextProduct(listName);
    }, 2000);
  }

  prevProduct(listName: string): void {
    if (this.productIndices[listName] > 0) {
      this.productIndices[listName]--;
    }
    this.updateTransform(listName);
  }

  nextProduct(listName: string): void {
    const listLength = this.getListLength(listName);
    const visibleItems = this.getVisibleItemsCount(listName);
    if (this.productIndices[listName] < listLength - visibleItems) {
      this.productIndices[listName]++;
    }
    this.updateTransform(listName);
  }

  updateTransform(listName: string): void {
    const carouselInner = document.querySelector(`.product-carousel-inner-${listName}`) as HTMLElement;
    const productWidth = 320; // Adjust this if your product width changes
    carouselInner.style.transform = `translateX(-${this.productIndices[listName] * productWidth}px)`;
  }

  getListLength(listName: string): number {
    switch (listName) {
      case 'products':
        return this.products.length;
      case 'offers':
        return this.productsoffer.length;
      case 'recompenses':
        return this.productsrecompense.length;
      default:
        return 0;
    }
  }

  getVisibleItemsCount(listName: string): number {
    const carousel = document.querySelector(`.product-carousel-inner-${listName}`) as HTMLElement;
    const carouselWidth = carousel.offsetWidth;
    const productWidth = 320; // Adjust this if your product width changes
    return Math.floor(carouselWidth / productWidth);
  }
}


