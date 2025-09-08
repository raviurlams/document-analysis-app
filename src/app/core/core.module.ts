import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { CoreRoutingModule } from './core-routing.module';
import { LoginComponent } from './login/login.component';
import { AngularMaterialModule } from '../angular-material.module';

@NgModule({
  declarations: [
    LoginComponent
  ],
  imports: [
    CommonModule,
    CoreRoutingModule,
    ReactiveFormsModule,
    AngularMaterialModule
  ]
})
export class CoreModule { }