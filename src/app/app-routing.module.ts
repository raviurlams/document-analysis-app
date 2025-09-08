import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: '/document-analysis', pathMatch: 'full' },
  { 
    path: 'login', 
    loadChildren: () => import('./core/core.module').then(m => m.CoreModule) 
  },
  { 
    path: 'document-analysis', 
    loadChildren: () => import('./features/document-analysis/document-analysis.module').then(m => m.DocumentAnalysisModule),
    canActivate: [AuthGuard]
  },
  { path: '**', redirectTo: '/document-analysis' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }