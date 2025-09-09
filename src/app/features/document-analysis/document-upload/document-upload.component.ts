import { Component, ElementRef, ViewChild, computed } from '@angular/core';
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
  
  // Use computed signal for loading state
  isLoading = computed(() => this.loadingService.isLoading());

  constructor(
    private documentService: DocumentService,
    private loadingService: LoadingService,
    private snackBar: MatSnackBar
  ) {}

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    console.log('File selected:', file);
    
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
    console.log('Upload button clicked');
    
    if (this.selectedFile) {
      console.log('Uploading file:', this.selectedFile.name);
      
      this.documentService.uploadDocument(this.selectedFile).subscribe({
        next: (document) => {
          console.log('Upload successful:', document);
          this.clearFileSelection();
          this.snackBar.open('Document uploaded successfully', 'Close', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
        },
        error: (error) => {
          console.error('Upload failed', error);
          this.snackBar.open('Upload failed. Please try again.', 'Close', {
            duration: 3000,
            panelClass: ['error-snackbar']
          });
        }
      });
    } else {
      console.log('No file selected');
      this.snackBar.open('Please select a file first', 'Close', {
        duration: 3000
      });
    }
  }

  triggerFileInput(): void {
    this.fileInput.nativeElement.click();
  }

  clearFileSelection(): void {
    this.selectedFile = null;
    this.fileInput.nativeElement.value = '';
  }

  isValidFileType(file: File): boolean {
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'text/plain'];
    const isValid = allowedTypes.includes(file.type);
    console.log('File type validation:', file.type, isValid);
    return isValid;
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}