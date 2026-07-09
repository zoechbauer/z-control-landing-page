import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit, inject } from '@angular/core';
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
    MarkdownComponent,
  ],
})
export class MarkdownViewerComponent implements OnInit {
  private readonly http = inject(HttpClient);
  private readonly modalController = inject(ModalController);

  @Input() fullChangeLogPath!: string;
  @Input() title: string = 'Release Notes';
  markdown: string = '';

  ngOnInit() {
    this.loadMarkdownChangelog();
  }

  closeModal() {
    this.modalController.dismiss();
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
