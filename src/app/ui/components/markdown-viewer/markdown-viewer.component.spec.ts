import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {
  provideHttpClientTesting,
  HttpTestingController,
} from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { MarkdownModule } from 'ngx-markdown';
import { IonicModule } from '@ionic/angular';
import { ModalController } from '@ionic/angular/standalone';

import { MarkdownViewerComponent } from './markdown-viewer.component';

describe('MarkdownViewerComponent', () => {
  let component: MarkdownViewerComponent;
  let fixture: ComponentFixture<MarkdownViewerComponent>;
  let httpMock: HttpTestingController;
  let modalControllerSpy: jasmine.SpyObj<ModalController>;

  beforeEach(waitForAsync(() => {
    modalControllerSpy = jasmine.createSpyObj('ModalController', ['dismiss']);

    TestBed.configureTestingModule({
      imports: [
        MarkdownViewerComponent,
        IonicModule.forRoot(),
        MarkdownModule.forRoot(),
      ],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: ModalController, useValue: modalControllerSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MarkdownViewerComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);

    // Manually replace the modalController
    (component as any).modalController = modalControllerSpy;
  }));

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should close modal when closeModal is called', () => {
    component.closeModal();
    expect(modalControllerSpy.dismiss).toHaveBeenCalled();
  });

  describe('ngOnInit method', () => {
    it('should load markdown content on ngOnInit', () => {
      const mockMarkdown = '# Test Changelog';
      component.fullChangeLogPath = 'assets/changelog.md';

      component.ngOnInit();

      const req = httpMock.expectOne('assets/changelog.md');
      req.flush(mockMarkdown);

      expect(component.markdown).toBe(mockMarkdown);
    });

    it('should handle HTTP error when loading markdown fails', () => {
      spyOn(console, 'error');
      component.fullChangeLogPath = 'assets/nonexistent.md';

      component.ngOnInit();

      const req = httpMock.expectOne('assets/nonexistent.md');
      req.error(new ErrorEvent('Network error'));

      expect(console.error).toHaveBeenCalledWith(
        'Error loading changelog:',
        jasmine.any(Object),
      );
      expect(component.markdown).toBe('');
    });

    it('should handle large markdown files', () => {
      const largeMockdown = '#'.repeat(1000) + ' Large Content';
      component.fullChangeLogPath = 'assets/large.md';

      component.ngOnInit();

      const req = httpMock.expectOne('assets/large.md');
      req.flush(largeMockdown);

      expect(component.markdown).toBe(largeMockdown);
    });

    it('should handle empty markdown response', () => {
      component.fullChangeLogPath = 'assets/empty.md';

      component.ngOnInit();

      const req = httpMock.expectOne('assets/empty.md');
      req.flush('');

      expect(component.markdown).toBe('');
    });
  });

  it('should initialize with empty markdown string', () => {
    expect(component.markdown).toBe('');
  });

  it('should require fullChangeLogPath input', () => {
    component.fullChangeLogPath = 'some/path.md';
    expect(component.fullChangeLogPath).toBeDefined();
  });
});
