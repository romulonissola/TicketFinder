import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TapComponent } from './tap.component';

const routes: Routes = [
  {
      path: '', component: TapComponent
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TapRoutingModule { }
