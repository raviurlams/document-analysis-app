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
  private _documents = signal<Document[]>([]);
  private _currentDocument = signal<Document | null>(null);

  // Expose signals as read-only
  documents = this._documents.asReadonly();
  currentDocument = this._currentDocument.asReadonly();

  constructor(private http: HttpClient) {
    this.loadDocuments();
  }

  setCurrentDocument(document: Document) {
    this._currentDocument.set(document);
  }

  uploadDocument(file: File): Observable<Document> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('fileName', file.name);
    formData.append('fileType', file.type);
    formData.append('fileSize', file.size.toString());

    console.log('Uploading file to server:', file.name);

    return this.http.post<Document>('/api/documents/upload', formData).pipe(
      tap({
        next: (document) => {
          console.log('Upload successful, updating documents list');
          this._documents.update(docs => [document, ...docs]);
          this._currentDocument.set(document);
        },
        error: (error) => {
          console.error('Upload error:', error);
        }
      })
    );
  }

  analyzeDocument(documentId: string): Observable<DocumentAnalysis> {
    return this.http.post<DocumentAnalysis>(`/api/documents/${documentId}/analyze`, {}).pipe(
      tap(analysis => {
        const currentDoc = this._currentDocument();
        if (currentDoc && currentDoc.id === documentId) {
          const updatedDoc = { ...currentDoc, analysis };
          this._currentDocument.set(updatedDoc);
        }
        
        this._documents.update(docs => 
          docs.map(doc => doc.id === documentId ? { ...doc, analysis } : doc)
        );
      })
    );
  }

  private loadDocuments(): void {
    this.http.get<Document[]>('/api/documents').subscribe({
      next: documents => {
        console.log('Loaded documents:', documents.length);
        this._documents.set(documents);
      },
      error: error => console.error('Failed to load documents', error)
    });
  }
}