import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DocumentViewComponent } from './document-view/document-view.component';
import { DocumentUploadComponent } from './document-upload/document-upload.component';

const routes: Routes = [
  { path: '', component: DocumentViewComponent },
  { path: 'upload', component: DocumentUploadComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DocumentAnalysisRoutingModule { }