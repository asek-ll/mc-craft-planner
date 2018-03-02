import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { ItemsComponent } from './items/items.component';

import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ItemsService } from './items/items.service';
import { DataRequester } from './data-requester';
import { NgxElectronModule } from 'ngx-electron';
import { MaterialModule } from './material/material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ItemComponent } from './item/item.component';
import { RecipesService } from './recipes/recipes.service';
import { ItemStackComponent } from './item-stack/item-stack.component';
import { RecipeComponent } from './recipe/recipe.component';
import { PositionedItemStackComponent } from './positioned-item-stack/positioned-item-stack.component';
import { ItemIconComponent } from './item-icon/item-icon.component';
import { ItemUsesComponent } from './item-uses/item-uses.component';
import { PagedListComponent } from './paged-list/paged-list.component';
import { RecipesComponent } from './recipes/recipes.component';
import { RecipeDetailComponent } from './recipe-detail/recipe-detail.component';
import { InventoryComponent } from './inventory/inventory.component';
import { ItemPickerComponent } from './item-picker/item-picker.component';

@NgModule({
  declarations: [
    AppComponent,
    ItemsComponent,
    ItemComponent,
    ItemStackComponent,
    RecipeComponent,
    PositionedItemStackComponent,
    ItemIconComponent,
    ItemUsesComponent,
    PagedListComponent,
    RecipesComponent,
    RecipeDetailComponent,
    InventoryComponent,
    ItemPickerComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot([{
      path: 'items',
      component: ItemsComponent,
    }, {
      path: 'item/:sid',
      component: ItemComponent,
    }, {
      path: 'uses/:sid',
      component: ItemUsesComponent,
    }, {
      path: 'recipes',
      component: RecipesComponent
    }, {
      path: 'recipe/:id',
      component: RecipeDetailComponent
    }, {
      path: '',
      redirectTo: '/items',
      pathMatch: 'full'
    }], {
        enableTracing: true,
        useHash: true
      }
    ),
    NgxElectronModule,
    MaterialModule,
    BrowserAnimationsModule,
  ],
  providers: [
    ItemsService,
    RecipesService,
    DataRequester,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor() {
    console.log('Init app module');
  }
}
