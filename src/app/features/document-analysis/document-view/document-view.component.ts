import { Component, OnInit } from '@angular/core';
import { DocumentService } from '../../../services/document.service';

@Component({
  selector: 'app-document-view',
  templateUrl: './document-view.component.html',
  styleUrls: ['./document-view.component.scss']
})
export class DocumentViewComponent implements OnInit {
  documents = this.documentService.getDocuments();
  currentDocument = this.documentService.getCurrentDocument();

  constructor(private documentService: DocumentService) {}

  ngOnInit(): void {}

  analyzeDocument(documentId: string): void {
    this.documentService.analyzeDocument(documentId).subscribe({
      next: (analysis) => {
        console.log('Analysis completed', analysis);
      },
      error: (error) => {
        console.error('Analysis failed', error);
      }
    });
  }

  selectDocument(document: any): void {
    this.documentService.setCurrentDocument(document);
  }

  // Helper method to safely access analysis data
  hasAnalysis(): boolean {
    return !!this.currentDocument()?.analysis;
  }
}