import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TapRoutingModule } from './tap-routing.module';
import { TapComponent } from './tap.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [
    TapComponent
  ],
  imports: [
    CommonModule,
    TapRoutingModule,
    SharedModule
  ]
})
export class TapModule { }
