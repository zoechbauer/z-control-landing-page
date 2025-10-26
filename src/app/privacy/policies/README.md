# Privacy Policy Templates

## Important Note

The privacy policy HTML templates have been moved to the `assets/privacy/policies/` folder for HTTP access by the Angular application.

## Why Templates Are in Assets Folder

- **HTTP Access**: Angular's HttpClient can only load files from the `assets/` directory when serving static content
- **Runtime Loading**: The privacy service loads HTML content dynamically at runtime via HTTP requests
- **Production Builds**: The Angular build process automatically includes files from `assets/` in the production bundle

## Template Locations

- **z-control QR Code Generstor (English)**: `src/assets/privacy/policies/qr-code-generator/qr-code-generator-en.html`
- **z-control QR Code Generstor (German)**: `src/assets/privacy/policies/qr-code-generator/qr-code-generator-de.html`
- **z-control Landing Page (English)**: `src/assets/privacy/policies/landing-page/landing-page-en.html`
- **z-control Landing Page (German)**: `src/assets/privacy/policies/landing-page/landing-page-de.html`
- **Premium Policy (English) - not used**: `src/assets/privacy/policies/premium/premium-en.html`
- **Premium Policy (German) - not used**: `src/assets/privacy/policies/premium/premium-de.html`

## How It Works

The `PrivacyService` loads these templates using HTTP:

```typescript
private loadPolicyContent(type: string, language: string): Observable<string> {
  const fileName = `${type}-${language}.html`;
  const filePath = `assets/privacy/policies/${type}/${fileName}`;
  return this.http.get(filePath, { responseType: 'text' });
}
```

## Editing Templates

To edit privacy policy content:

1. Navigate to `src/assets/privacy/policies/`
2. Edit the appropriate HTML file (e.g., `landing-page/landing-page-en.html`)
3. The changes will be reflected immediately in the application

## Do Not Duplicate

Do not create privacy policy files in the `src/app/privacy/policies/` folder - they should only exist in the assets folder to maintain the DRY principle.
