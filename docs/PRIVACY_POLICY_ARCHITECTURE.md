# Privacy Policy System Architecture

### **File Structure**

```
src/
├── assets/privacy/policies/           # ✅ HTML templates served by web server
│   ├── basic/
│   │   ├── basic-en.html             # ✅ z-control QR Code App - English
│   │   └── basic-de.html             # ✅ z-control QR Code App - German
│   └── premium/
│       ├── premium-en.html           # ✅ Premium features - English
│       └── premium-de.html           # ✅ Premium features - German
|
└── app/privacy/
    ├── services/
    │   └── privacy.service.ts         # ✅ HTTP-based HTML loading service
    ├── components/
    │   └── privacy-viewer/            # ✅ Professional viewer component
    └── policies/
        └── README.md                  # ✅ Explains template location
```

### **Key Technical Implementation**

#### **File Organization & DRY Principle**

- **Single Source of Truth**: All privacy policy HTML templates are stored only in `src/assets/privacy/policies/`
- **No Duplication**: The `src/app/privacy/policies/` folder contains only a README.md explaining the architecture
- **HTTP Access**: Templates are loaded dynamically via Angular's HttpClient from the assets folder
- **Enterprise Policies**: Removed as discussed - only basic and premium policies are maintained

#### **Privacy Service (Final)**

```typescript
// ✅ Loads actual HTML files via HTTP
private loadPolicyContent(type: string, language: string): Observable<string> {
  const fileName = `${type}-${language}.html`;
  const filePath = `assets/privacy/policies/${type}/${fileName}`;
  return this.http.get(filePath, { responseType: 'text' });
}

// ✅ Returns policy with real HTML content
getPolicy(type: string, language: string): Observable<PrivacyPolicy | null> {
  return this.loadPolicyContent(type, language).pipe(
    map(content => ({
      type: type as any,
      language: language as any,
      title: this.getTitle(type, language),
      content, // ✅ Real HTML from files
      lastUpdated: '2025-06-30',
    })),
    catchError(() => of(null))
  );
}
```

#### **HTTP Client Integration**

```typescript
// ✅ Added to main.ts
import { provideHttpClient } from "@angular/common/http";

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(), // ✅ Enables HTTP loading of HTML files
    // ...other providers
  ],
});
```

#### **Routing (Final)**

```typescript
// ✅ Clean routing structure
{
  path: 'privacy-policy',
  redirectTo: 'privacy/basic/en',  // ✅ Legacy redirect
  pathMatch: 'full'
},
{
  path: 'privacy/:type/:language',
  loadComponent: () => import('./privacy/components/privacy-viewer/privacy-viewer.component')
    .then(m => m.PrivacyViewerComponent)
}
```

### **URLs for Applications**

#### **Landing Page (Web)**

- Privacy Policy: `https://yoursite.com/privacy/basic/en`
- German Version: `https://yoursite.com/privacy/basic/de`

#### **Mobile Apps**

- **z-control QR Code App (English)**: `https://yoursite.com/privacy/basic/en`
- **z-control QR Code App (German)**: `https://yoursite.com/privacy/basic/de`
- **Future Premium Features (English)**: `https://yoursite.com/privacy/premium/en`
- **Future Premium Features (German)**: `https://yoursite.com/privacy/premium/de`

### **Service Usage (Same for All Apps)**

```typescript
// ✅ Same API for landing page and mobile apps
this.privacyService.getPolicy("basic", "en").subscribe((policy) => {
  console.log(policy.title); // "Privacy Policy - z-control QR Code App"
  console.log(policy.content); // Full HTML from basic-en.html file
});

this.privacyService.getPolicy("basic", "de").subscribe((policy) => {
  console.log(policy.title); // "Datenschutzerklärung - z-control QR Code App"
  console.log(policy.content); // Full HTML from basic-de.html file
});
```

## Benefits

- **DRY Principle**: Single source of truth for privacy policy templates in assets folder
- **No Duplication**: Eliminated duplicate policy files, reduced maintenance overhead
- **Clean Architecture**: Clear separation between service logic and template content
- **Scalability**: Easy to add new policy types and languages by adding HTML files to assets
- **Maintainability**: Organized folder structure with clear documentation
- **HTTP-Based Loading**: Proper web standard for loading static content
- **SEO Friendly**: Proper URLs for different policies
- **User Experience**: Language switching, loading states, responsive design
