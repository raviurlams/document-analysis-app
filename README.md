# Document Analysis Application

An Angular 17 application for analyzing documents with text extraction and entity recognition.

## Features

- User authentication with cookie-based sessions
- Document upload (PDF, images, text files)
- Document analysis with text extraction
- Entity recognition and metadata extraction
- Responsive design with Angular Material
- Loading indicators for API calls
- Form validation

## Installation

1. Install dependencies:
```bash
rm -rf node_modules package-lock.json
npm cache clean --force
npm i --save

# Run All Tests
npm test

##Run Specific Test Files

# Run auth service tests
ng test --include='**/auth.service.spec.ts'

# Run document service tests  
ng test --include='**/document.service.spec.ts'

# Run login component tests
ng test --include='**/login.component.spec.ts'

# Run Tests with Code Coverage
ng test --code-coverage

# for Dev
ng test --watch 
ng test --browsers=ChromeDebug