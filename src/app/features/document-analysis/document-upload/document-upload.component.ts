import { Component, ElementRef, ViewChild, effect } from '@angular/core';
import { DocumentService } from '../../../services/document.service';
import { LoadingService } from '../../../services/loading.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-document-upload',
  templateUrl: './document-upload.component.html',
  styleUrls: ['./document-upload.component.scss']
})
export class DocumentUploadComponent {
  @ViewChild('fileInput') fileInput!: ElementRef;
  selectedFile: File | null = null;
  isLoading = false;

  constructor(
    private documentService: DocumentService,
    private loadingService: LoadingService,
    private snackBar: MatSnackBar
  ) {
    // Use effect to react to loading state changes
    effect(() => {
      this.isLoading = this.loadingService.isLoading();
    });
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file && this.isValidFileType(file)) {
      this.selectedFile = file;
    } else {
      this.selectedFile = null;
      this.snackBar.open('Please select a valid PDF, image, or text file', 'Close', {
        duration: 3000
      });
    }
  }

  uploadDocument(): void {
    if (this.selectedFile) {
      this.documentService.uploadDocument(this.selectedFile).subscribe({
        next: (document) => {
          this.selectedFile = null;
          this.fileInput.nativeElement.value = '';
          this.snackBar.open('Document uploaded successfully', 'Close', {
            duration: 3000
          });
        },
        error: (error) => {
          console.error('Upload failed', error);
          this.snackBar.open('Upload failed. Please try again.', 'Close', {
            duration: 3000
          });
        }
      });
    }
  }

  triggerFileInput(): void {
    this.fileInput.nativeElement.click();
  }

  isValidFileType(file: File): boolean {
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'text/plain'];
    return allowedTypes.includes(file.type);
  }

  // File size formatter (instead of pipe)
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}