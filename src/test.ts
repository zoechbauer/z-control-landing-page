import 'zone.js/testing';
import { TestBed } from '@angular/core/testing';
import {
  BrowserTestingModule,
  platformBrowserTesting,
} from '@angular/platform-browser/testing';

if (typeof window !== 'undefined') {
  const style = document.createElement('style');
  style.innerHTML = `
    body {
      overflow-y: auto !important;
      height: auto !important;
    }

    #karma {
      max-height: 100vh;
      overflow-y: auto;
    }

    .jasmine_html-reporter {
      max-height: 90vh;
      overflow-y: auto;
    }

    .summary {
      position: sticky;
      top: 0;
      background: white;
      z-index: 1000;
    }
  `;
  document.head.appendChild(style);
}

TestBed.initTestEnvironment(
  BrowserTestingModule,
  platformBrowserTesting(),
);