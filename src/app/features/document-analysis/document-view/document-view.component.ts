import { Component, OnInit, computed } from '@angular/core';
import { DocumentService } from '../../../services/document.service';

@Component({
  selector: 'app-document-view',
  templateUrl: './document-view.component.html',
  styleUrls: ['./document-view.component.scss']
})
export class DocumentViewComponent implements OnInit {
  // Use computed signals to access the service signals
  documents = computed(() => this.documentService.documents());
  currentDocument = computed(() => this.documentService.currentDocument());

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
    debugger
    this.documentService.setCurrentDocument(document);
  }

  // Helper method to safely access analysis data
  hasAnalysis(): boolean {
    const currentDoc = this.currentDocument();
    return !!currentDoc?.analysis;
  }
}