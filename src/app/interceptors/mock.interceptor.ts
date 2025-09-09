import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse
} from '@angular/common/http';
import { Observable, of, delay, from, switchMap } from 'rxjs';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

interface MockResponse {
  status: number;
  body: any;
}

interface MockEndpoint {
  pattern: string | RegExp;
  handler: (req: HttpRequest<any>) => MockResponse | null;
}

@Injectable()
export class MockInterceptor implements HttpInterceptor {

  private mockEndpoints: MockEndpoint[] = [];
  private documents: any[] = [];
  private users: any[] = [];
  private isInitialized = false;

  constructor(private http: HttpClient) {
    if (environment.useMockApi) {
      this.initializeMockData();
    }
  }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // Only mock if enabled and it's an API call
    if (environment.useMockApi && request.url.includes('/api/') && !request.url.includes('i18n')) {
      // If not initialized yet, wait for initialization
      if (!this.isInitialized) {
        return from(this.initializeMockData()).pipe(
          switchMap(() => {
            const mockResponse = this.getMockResponse(request);
            if (mockResponse) {
              return of(new HttpResponse(mockResponse)).pipe(delay(500));
            }
            return next.handle(request);
          })
        );
      }
      
      const mockResponse = this.getMockResponse(request);
      if (mockResponse) {
        // Simulate network delay
        return of(new HttpResponse(mockResponse)).pipe(delay(500));
      }
    }
    
    // Pass through non-mocked requests
    return next.handle(request);
  }

  private async initializeMockData(): Promise<void> {
    try {
      // Initialize mockEndpoints array first
      this.mockEndpoints = [];
      
      // Load users from JSON file
      const usersData = await this.http.get<any>('/assets/mock-data/users.json').toPromise();
      this.users = usersData.users || [];
      
      // Load documents from JSON file
      const documentsData = await this.http.get<any>('/assets/mock-data/documents.json').toPromise();
      this.documents = documentsData.documents || [];
      
      // Parse date strings to Date objects
      this.documents.forEach(doc => {
        if (doc.uploadDate) {
          doc.uploadDate = new Date(doc.uploadDate);
        }
      });
      
      // Initialize mock endpoints
      this.initializeMockEndpoints();
      
      this.isInitialized = true;
      
      console.log('Mock data loaded successfully:', {
        users: this.users.length,
        documents: this.documents.length
      });
    } catch (error) {
      console.error('Failed to load mock data:', error);
      // Fallback to default data if JSON files can't be loaded
      this.loadFallbackData();
      this.initializeMockEndpoints();
      this.isInitialized = true;
    }
  }

  private loadFallbackData(): void {
    // Fallback data in case JSON files can't be loaded
    this.users = [
      { id: '1', email: 'admin@example.com', password: 'Password123!', name: 'Admin User', role: 'admin' },
      { id: '2', email: 'user@example.com', password: 'Password123!', name: 'Regular User', role: 'user' }
    ];

    this.documents = [
      {
        id: '1',
        fileName: 'Ranasthalam Sale Agreement.pdf',
        uploadDate: new Date('2024-07-22'),
        fileSize: 24576,
        fileType: 'pdf',
        content: 'Sample document content...',
        analysis: {
          totalPages: 3,
          extractedText: 'Sample extracted text...',
          metadata: { title: 'Ranasthalam Sale Agreement', author: 'Unknown' },
          entities: [{ type: 'PERSON', value: 'LAKSHMI', count: 1 }],
          summary: 'Property sale agreement document'
        }
      }
    ];
  }

  private initializeMockEndpoints(): void {
    // Clear any existing endpoints
    this.mockEndpoints = [];

    // Auth login endpoint
    this.mockEndpoints.push({
      pattern: '/api/auth/login',
      handler: (req: HttpRequest<any>) => {
        if (req.method !== 'POST') return null;
        
        const { email, password } = req.body;
        const user = this.users.find(u => u.email === email && u.password === password);
        
        if (user) {
          return {
            status: 200,
            body: {
              token: 'mock-jwt-token-' + user.id,
              user: { 
                id: user.id, 
                email: user.email, 
                name: user.name,
                role: user.role 
              }
            }
          };
        } else {
          return {
            status: 401,
            body: { message: 'Invalid email or password' }
          };
        }
      }
    });

    // Get all documents endpoint
    this.mockEndpoints.push({
      pattern: '/api/documents',
      handler: (req: HttpRequest<any>) => {
        if (req.method !== 'GET') return null;
        
        return {
          status: 200,
          body: this.documents
        };
      }
    });

    // Upload document endpoint
    this.mockEndpoints.push({
      pattern: '/api/documents/upload',
      handler: (req: HttpRequest<any>) => {
        if (req.method !== 'POST') return null;
        
        const file = req.body.get('file');
        const newDocument = {
          id: (this.documents.length + 1).toString(),
          fileName: file.name,
          uploadDate: new Date(),
          fileSize: file.size,
          fileType: file.name.split('.').pop()?.toLowerCase(),
          content: 'Uploaded content will be processed...',
          analysis: null
        };
        
        this.documents.unshift(newDocument); // Add to beginning of array
        
        return {
          status: 200,
          body: newDocument
        };
      }
    });

    // Analyze document endpoint
    this.mockEndpoints.push({
      pattern: /\/api\/documents\/\d+\/analyze/,
      handler: (req: HttpRequest<any>) => {
        if (req.method !== 'POST') return null;
        
        const documentId = req.url.split('/').pop();
        const document = this.documents.find(d => d.id === documentId);
        
        if (document) {
          // Simulate analysis results
          document.analysis = {
            totalPages: Math.floor(Math.random() * 10) + 1,
            extractedText: `Analyzed text content for ${document.fileName}\n\nThis is a simulated analysis result. The document contains important information that has been processed and extracted successfully.`,
            metadata: {
              analyzedAt: new Date().toISOString(),
              confidence: (Math.random() * 0.5 + 0.5).toFixed(2), // 0.5 to 1.0
              language: 'en',
              fileType: document.fileType?.toUpperCase() || 'UNKNOWN'
            },
            entities: [
              { type: 'DOCUMENT', value: document.fileName, count: 1 },
              { type: 'DATE', value: new Date().toISOString().split('T')[0], count: 1 },
              { type: 'FILE_TYPE', value: document.fileType?.toUpperCase() || 'UNKNOWN', count: 1 }
            ],
            summary: `This is a comprehensive analysis summary for "${document.fileName}". The document appears to contain structured information and has been processed successfully with high confidence.`
          };
          
          return {
            status: 200,
            body: document.analysis
          };
        }
        
        return {
          status: 404,
          body: { message: 'Document not found' }
        };
      }
    });

    // Get specific document endpoint
    this.mockEndpoints.push({
      pattern: /\/api\/documents\/\d+/,
      handler: (req: HttpRequest<any>) => {
        if (req.method !== 'GET') return null;
        
        const documentId = req.url.split('/').pop();
        const document = this.documents.find(d => d.id === documentId);
        
        if (document) {
          return {
            status: 200,
            body: document
          };
        }
        
        return {
          status: 404,
          body: { message: 'Document not found' }
        };
      }
    });

    // Delete document endpoint
    this.mockEndpoints.push({
      pattern: /\/api\/documents\/\d+/,
      handler: (req: HttpRequest<any>) => {
        if (req.method !== 'DELETE') return null;
        
        const documentId = req.url.split('/').pop();
        const index = this.documents.findIndex(d => d.id === documentId);
        
        if (index !== -1) {
          const deletedDoc = this.documents.splice(index, 1)[0];
          return {
            status: 200,
            body: { 
              message: 'Document deleted successfully',
              document: deletedDoc
            }
          };
        }
        
        return {
          status: 404,
          body: { message: 'Document not found' }
        };
      }
    });

    // User profile endpoint
    this.mockEndpoints.push({
      pattern: '/api/auth/profile',
      handler: (req: HttpRequest<any>) => {
        if (req.method !== 'GET') return null;
        
        const authHeader = req.headers.get('Authorization');
        if (authHeader && authHeader.startsWith('Bearer mock-jwt-token-')) {
          const userId = authHeader.replace('Bearer mock-jwt-token-', '');
          const user = this.users.find(u => u.id === userId);
          
          if (user) {
            return {
              status: 200,
              body: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role
              }
            };
          }
        }
        
        return {
          status: 401,
          body: { message: 'Unauthorized' }
        };
      }
    });
  }

  private getMockResponse(request: HttpRequest<any>): any {
    if (!this.mockEndpoints || this.mockEndpoints.length === 0) {
      return null;
    }
    
    for (const endpoint of this.mockEndpoints) {
      const matches = this.patternMatches(endpoint.pattern, request.url);
      
      if (matches) {
        const response = endpoint.handler(request);
        if (response) {
          return response;
        }
      }
    }
    
    return null;
  }

  private patternMatches(pattern: string | RegExp, url: string): boolean {
    if (typeof pattern === 'string') {
      return url === pattern;
    } else {
      return pattern.test(url);
    }
  }
}