import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

export interface Document {
  id: string;
  fileName: string;
  uploadDate: Date;
  content: string;
  analysis: DocumentAnalysis;
}

export interface DocumentAnalysis {
  totalPages: number;
  extractedText: string;
  metadata: any;
  entities: Entity[];
  summary: string;
}

export interface Entity {
  type: string;
  value: string;
  count: number;
}

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  private documents = signal<Document[]>([]);
  private currentDocument = signal<Document | null>(null);

  constructor(private http: HttpClient) {
    this.loadDocuments();
  }

  getDocuments() {
    return this.documents.asReadonly();
  }

  getCurrentDocument() {
    return this.currentDocument.asReadonly();
  }

  setCurrentDocument(document: Document) {
    this.currentDocument.set(document);
  }

  uploadDocument(file: File): Observable<Document> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<Document>('/api/documents/upload', formData).pipe(
      tap(document => {
        this.documents.update(docs => [document, ...docs]);
        this.currentDocument.set(document);
      })
    );
  }

  analyzeDocument(documentId: string): Observable<DocumentAnalysis> {
    return this.http.post<DocumentAnalysis>(`/api/documents/${documentId}/analyze`, {}).pipe(
      tap(analysis => {
        const updatedDoc = { ...this.currentDocument()!, analysis };
        this.currentDocument.set(updatedDoc);
        
        this.documents.update(docs => 
          docs.map(doc => doc.id === documentId ? updatedDoc : doc)
        );
      })
    );
  }

  private loadDocuments(): void {
    this.http.get<Document[]>('/api/documents').subscribe({
      next: documents => this.documents.set(documents),
      error: error => console.error('Failed to load documents', error)
    });
  }
}