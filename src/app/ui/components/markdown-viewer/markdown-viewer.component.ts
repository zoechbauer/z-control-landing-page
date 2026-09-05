import { HttpClient } from '@angular/common/http';
import {
  Component,
  Input,
  OnInit,
  inject,
  ViewChild,
} from '@angular/core';
import { UtilsService } from 'src/app/services/utils.service';
import { MarkdownComponent } from 'ngx-markdown';
import {
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonIcon,
  ModalController,
} from '@ionic/angular/standalone';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-markdown-viewer',
  templateUrl: './markdown-viewer.component.html',
  styleUrls: ['./markdown-viewer.component.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    IonIcon,
    NgIf,
    MarkdownComponent,
  ],
})
export class MarkdownViewerComponent implements OnInit {
  readonly utilsService = inject(UtilsService);
  private readonly http = inject(HttpClient);
  private readonly modalController = inject(ModalController);

  @Input() fullChangeLogPath!: string;
  @Input() title1line: string = 'z-control Release Notes';
  @Input() title2lines: string = 'z-control <br />Release Notes';
  @ViewChild('content', { static: false }) content!: IonContent;
  markdown: string = '';
  isPortrait = this.utilsService.isPortrait;

  ngOnInit() {
    this.loadMarkdownChangelog();
  }

  closeModal() {
    this.modalController.dismiss();
  }

  scrollToTop() {
    this.content.scrollToTop(300);
  }

  private loadMarkdownChangelog() {
    this.http.get(this.fullChangeLogPath, { responseType: 'text' }).subscribe({
      next: (data) => {
        this.markdown = data;
      },
      error: (error) => {
        console.error('Error loading changelog:', error);
      },
    });
  }
}
