import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout.component';


const routes: Routes = [
  {
      path: '', component: LayoutComponent,
      children: [
        {
          path: "",
          redirectTo: "home",
          pathMatch: "full",
        },
        {
          path: "home",
          loadChildren: () =>
            import("./home/home.module").then((m) => m.HomeModule),
        },
        {
          path: "tap",
          loadChildren: () =>
            import("./tap/tap.module").then((m) => m.TapModule),
        }
      ]
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LayoutRoutingModule { }
