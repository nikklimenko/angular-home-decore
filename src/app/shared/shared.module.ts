import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {PasswordRepeatDirective} from "./directives/password-repeat.directive";
import { ProductCartComponent } from './components/product-cart/product-cart.component';
import {RouterModule} from "@angular/router";
import {FormsModule} from "@angular/forms";
import { CategoryFilterComponent } from './components/category-filter/category-filter.component';
import { CountSelectorComponent } from './components/count-selector/count-selector.component';
import { LoaderComponent } from './components/loader/loader.component';
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";



@NgModule({
  declarations: [
    PasswordRepeatDirective,
    ProductCartComponent,
    CategoryFilterComponent,
    CountSelectorComponent,
    LoaderComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    MatProgressSpinnerModule,
    RouterModule,
  ],
  exports: [PasswordRepeatDirective, ProductCartComponent, CategoryFilterComponent, CountSelectorComponent, LoaderComponent],
})
export class SharedModule { }
