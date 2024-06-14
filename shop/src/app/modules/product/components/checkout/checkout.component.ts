import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { CartService } from 'src/app/core/services/cart.service';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { Product } from 'src/app/modules/product/model';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styles: []
})
export class CheckoutComponent implements OnInit {
  gstAmount!: number;
  grandTotal!: number;
  discount: number = 0; // Discount amount
  pointsToUse: number = 0; // Points to use for discount
  adjustedGrandTotal!: number; // Grand total after applying discount
  shippingForm!: FormGroup;
  user: any;
  cart: Product[] | any = [];
  errorMessage: string = '';

  constructor(
    private cartService: CartService,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.shippingForm = this.formBuilder.group({
      firstName: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(15)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      mobile: new FormControl('', [Validators.required, Validators.minLength(10)]),
      address: new FormControl('', [Validators.required]),
      city: new FormControl('', [Validators.required]),
      country: new FormControl('India', [Validators.required]),
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.cart = JSON.parse(params['cart']);
      this.discount = parseInt(params['discount']) || 0;
      this.grandTotal = parseInt(params['grandTotal']) || 0;
      this.pointsToUse = parseInt(params['pointsToUse']) || 0;

      // Recalculate adjustedGrandTotal after ensuring valid numbers
      this.adjustedGrandTotal = this.grandTotal - this.discount;
      console.log("Adjusted Grand Total:", this.adjustedGrandTotal);
    });

    this.getUserDetails();
    this.getTotal();
  }

  getUserDetails() {
    this.user = JSON.parse(localStorage.getItem('userconnect')!) || {}; // Initialize user as an empty object if null
    if (this.user) {
      this.shippingForm.patchValue({
        firstName: this.user.name || '',
        email: this.user.email || '',
        mobile: this.user.mobile || ''
      });
    }
  }

  getTotal() {
    this.cartService.gstAmount.subscribe(data => this.gstAmount = parseInt(data.toFixed(2)));
    this.cartService.estimatedTotal.subscribe(data => {
      this.grandTotal = parseInt(data.toFixed(2)) || 0; // Update grandTotal
      this.adjustedGrandTotal = this.grandTotal - this.discount; // Calculate adjustedGrandTotal
      console.log("Adjusted Grand Total in getTotal:", this.adjustedGrandTotal);
    });
  }

  get firstName() {
    return this.shippingForm.get('firstName');
  }
  get email() {
    return this.shippingForm.get('email');
  }
  get mobile() {
    return this.shippingForm.get('mobile');
  }
  get address() {
    return this.shippingForm.get('address');
  }
  get city() {
    return this.shippingForm.get('city');
  }
  get country() {
    return this.shippingForm.get('country');
  }

// cart.component.ts

onSave() {
  const cart = this.cartService.getCart;
  const products = cart.map((item: any) => ({
    product: item._id,
    price: item.price,
    qty: item.qty,
    title: item.title,
    storeLocation: item.storeLocation
  }));

  console.log("Products for location:", products);

  if (products.length === 0) {
    this.errorMessage = "Products array is empty";
    return;
  }

  const pointsPerProduct = 200;
  const totalPoints = products.length * pointsPerProduct;

  const orderDetails = {
    user: this.user.id,
    mobile: this.shippingForm.value.mobile,
    address: this.shippingForm.value.address,
    city: this.shippingForm.value.city,
    country: this.shippingForm.value.country,
    gstAmount: this.gstAmount,
    grandTotal: this.adjustedGrandTotal,
    discount: this.discount,
    products: products,
    pointsToUse: this.pointsToUse,
  };

  console.log("Order details:", orderDetails);

  Swal.fire({
    icon: 'success',
    title: 'Order saved successfully!',
    showConfirmButton: true,
    confirmButtonText: 'OK'
  }).then((result) => {
    if (result.isConfirmed || result.dismiss === Swal.DismissReason.backdrop) {
      this.authService.addCmd(orderDetails).subscribe(
        response => {
          console.log('Order saved successfully', response);
          this.shippingForm.reset();
          this.errorMessage = '';
          this.updateUserPoints(this.user.id, this.user.points + this.pointsToUse);
          const newPoints = 0;
          this.pointsToUse = newPoints;
          const user = JSON.parse(localStorage.getItem('userconnect')!);
          user.points = newPoints;
          localStorage.setItem('userconnect', JSON.stringify(user));
          // window.location.reload();
          this.router.navigate(["/"]);
        },
        error => {
          console.error('Error saving order', error);
          this.errorMessage = error.message || 'Error saving order';
          alert(this.errorMessage);
        }
      );
    }
  });
}


updateUserPoints(userId: string, newPoints: number) {
  this.authService.updateUserPoints(userId, newPoints).subscribe(
      response => {
          console.log('User points updated successfully', response);
          this.user.points = newPoints; // Update points in local user object
          console.log("yaaaaaaaa", newPoints);
          
          localStorage.setItem('userconnect', JSON.stringify(this.user)); // Update local storage
          localStorage.setItem('point', JSON.stringify(newPoints)); // Update local storage
      },
      error => {
          console.error('Error updating user points', error);
          this.errorMessage = error.message || 'Error updating user points';
          alert(this.errorMessage);
      }
  );
}



}
