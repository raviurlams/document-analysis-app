import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { DocumentService, Document, DocumentAnalysis } from './document.service';

describe('DocumentService', () => {
  let service: DocumentService;
  let httpMock: HttpTestingController;

  const mockDocument: Document = {
    id: '1',
    fileName: 'test.pdf',
    uploadDate: new Date(),
    content: 'Test content',
    analysis: {
      totalPages: 1,
      extractedText: 'Test content',
      metadata: {},
      entities: [],
      summary: 'Test summary'
    }
  };

  const mockAnalysis: DocumentAnalysis = {
    totalPages: 1,
    extractedText: 'Analyzed content',
    metadata: { author: 'Test Author' },
    entities: [{ type: 'PERSON', value: 'John Doe', count: 1 }],
    summary: 'Analyzed summary'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [DocumentService]
    });

    service = TestBed.inject(DocumentService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should upload a document', () => {
    const mockFile = new File([''], 'test.pdf', { type: 'application/pdf' });

    service.uploadDocument(mockFile).subscribe(document => {
      expect(document).toEqual(mockDocument);
    });

    const req = httpMock.expectOne('/api/documents/upload');
    expect(req.request.method).toBe('POST');
    req.flush(mockDocument);
  });

  it('should analyze a document', () => {
    // First set a current document
    service.setCurrentDocument(mockDocument);

    service.analyzeDocument('1').subscribe(analysis => {
      expect(analysis).toEqual(mockAnalysis);
    });

    const req = httpMock.expectOne('/api/documents/1/analyze');
    expect(req.request.method).toBe('POST');
    req.flush(mockAnalysis);
  });

  it('should load documents on initialization', () => {
    const mockDocuments: Document[] = [mockDocument];

    // The service loads documents on initialization
    const req = httpMock.expectOne('/api/documents');
    expect(req.request.method).toBe('GET');
    req.flush(mockDocuments);

    // Check if documents were set
    service.getDocuments().subscribe(docs => {
      expect(docs).toEqual(mockDocuments);
    });
  });

  it('should set and get current document', () => {
    service.setCurrentDocument(mockDocument);
    
    service.getCurrentDocument().subscribe(doc => {
      expect(doc).toEqual(mockDocument);
    });
  });
});