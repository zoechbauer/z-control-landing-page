import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ModalController } from '@ionic/angular/standalone';
import { MarkdownModule } from 'ngx-markdown';

import { MarkdownViewerComponent } from './markdown-viewer.component';

describe('MarkdownViewerComponent', () => {
  let component: MarkdownViewerComponent;
  let fixture: ComponentFixture<MarkdownViewerComponent>;

  beforeEach(waitForAsync(() => {
    const modalControllerSpy = jasmine.createSpyObj('ModalController', [
      'dismiss',
    ]);

    TestBed.configureTestingModule({
      imports: [
        MarkdownViewerComponent,
        HttpClientTestingModule,
        MarkdownModule.forRoot(),
      ],
      providers: [{ provide: ModalController, useValue: modalControllerSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(MarkdownViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
