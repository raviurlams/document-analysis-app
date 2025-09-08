import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { DocumentAnalysisRoutingModule } from './document-analysis-routing.module';
import { DocumentUploadComponent } from './document-upload/document-upload.component';
import { DocumentViewComponent } from './document-view/document-view.component';
import { AngularMaterialModule } from '../../angular-material.module';
import { FileSizePipe } from '../../shared/pipes/file-size.pipe'; 

@NgModule({
  declarations: [
    DocumentUploadComponent,
    DocumentViewComponent,
    FileSizePipe
  ],
  imports: [
    CommonModule,
    DocumentAnalysisRoutingModule,
    ReactiveFormsModule,
    AngularMaterialModule
  ]
})
export class DocumentAnalysisModule { }