import {Component, Input, OnInit} from '@angular/core';
import {FavoriteService} from "../../../shared/services/favorite.service";
import {FavoriteType} from "../../../../types/favorite.type";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {environment} from "../../../../environments/environment";
import {CartType} from "../../../../types/cart.type";
import {CartService} from "../../../shared/services/cart.service";
import {ProductType} from "../../../../types/product.type";

@Component({
  selector: 'app-favorite',
  templateUrl: './favorite.component.html',
  styleUrls: ['./favorite.component.scss']
})
export class FavoriteComponent implements OnInit{

  @Input() product!: ProductType;
  serverStaticPath: string = environment.serverStaticPath;
  products: FavoriteType[] = [];
  constructor(private favoriteService: FavoriteService,
              private cartService: CartService,) {
  }

  ngOnInit() {
    this.favoriteService.getFavorites()
      .subscribe((data: FavoriteType[] | DefaultResponseType) => {
        if((data as DefaultResponseType).error !== undefined){
          const error = (data as DefaultResponseType).message;
          throw new Error(error);
        }

        this.products = data as FavoriteType[];
        this.products.map(item => item.count = 1)

        this.cartService.getCart()
          .subscribe((data: CartType | DefaultResponseType) => {
            if ((data as DefaultResponseType).error !== undefined) {
              throw new Error((data as DefaultResponseType).message);
            }

            const cart = data as CartType;
            cart.items.forEach(cartItem => {
              this.products.map(product => {
                if(product.id === cartItem.product.id){
                  product.count = cartItem.quantity;
                  product.isInCart = true;
                }
                return product;
              })
            })
          })
      });
  }

  removeFromFavorites(id: string){
    this.favoriteService.removeFavorite(id)
      .subscribe((data: DefaultResponseType) => {
        if(data.error){
          //...
          throw new Error(data.message);
        }
        this.products = this.products.filter(item => item.id !== id);
      })
  }

  addToCart(id: string, count: number){
    this.cartService.updateCart(id, count)
      .subscribe((data: CartType | DefaultResponseType) => {
        if((data as DefaultResponseType).error !== undefined){
          throw new Error((data as DefaultResponseType).message);
        }

        const product = this.products.find(item => item.id === id);
        if(product){
          product.count = count;
          product.isInCart = true;
        }
      });
  }

  updateCount(id: string, count: number) {
    const product = this.products.find(item => item.id === id);
    if (product && product.isInCart) {
      this.cartService.updateCart(id, count)
        .subscribe((data: CartType | DefaultResponseType) => {
          if ((data as DefaultResponseType).error !== undefined) {
            throw new Error((data as DefaultResponseType).message);
          }
          let foundProduct = this.products.find(item => item.id === id);
          if(foundProduct){
            foundProduct.count = count;
          }
        })
    }
  }


  removeFromCart(id: string){
    this.cartService.updateCart(id, 0)
      .subscribe((data: CartType | DefaultResponseType) => {
        if((data as DefaultResponseType).error !== undefined){
          throw new Error((data as DefaultResponseType).message);
        }
        const removedProduct = this.products.find(item => item.id === id);
        if(removedProduct){
          removedProduct.count = 1;
          removedProduct.isInCart = false;
        }
      });
  }

}
