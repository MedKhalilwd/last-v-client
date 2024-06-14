// app-routing.module.ts
import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './core/components/home/home.component';
import { LoginComponent } from './core/components/login/login.component';
import { RegisterComponent } from './core/components/register/register.component';
import { CartComponent } from './core/components/cart/cart.component';
import { Page404Component } from './core/components/page404/page404.component';
import { CheckoutComponent } from './modules/product/components/checkout/checkout.component';
import { SearchresultComponent } from './core/components/searchresult/searchresult.component';
import { RecompenseComponent } from './recompense/recompense.component'; // Import the new component
import { OffersComponent } from './offers/offers.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'register',
    component: RegisterComponent,
  },
  {
    path: 'products',
    component: SearchresultComponent
  },
  {
    path: 'categories',
    loadChildren: () => import('./modules/product/product.module').then(m => m.ProductModule)
  },
  {
    path: 'shopping-cart',
    component: CartComponent
  },
  {
    path: 'checkout',
    component: CheckoutComponent,
  },
  {
    path: 'recempense', // Add the new route
    component: RecompenseComponent
  },
  {
    path: 'offers', // Add the new route
    component: OffersComponent
  },
  {
    path: '**',
    component: Page404Component,
    data: { message: 'Oops... This is a Bad request' }
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
