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

  @Input() fullPath!: string;
  @Input() title1line: string = 'z-control file data';
  @Input() title2lines: string = 'z-control <br />file data';
  @ViewChild('content', { static: false }) content!: IonContent;
  markdown: string = '';
  isPortrait = this.utilsService.isPortrait;

  ngOnInit() {
    this.loadFile();
  }

  /**
   * Closes the modal dialog.
   */
  closeModal() {
    this.modalController.dismiss();
  }

  /**
   * Scrolls the content to the top.
   * @returns A promise that resolves when the scroll animation is complete.
   */
  scrollToTop(): Promise<void> {
    return this.content.scrollToTop(300);
  }

  /**
   * Loads the file from the specified path.
   */
  private loadFile() {
    this.http.get(this.fullPath, { responseType: 'text' }).subscribe({
      next: (data) => {
        this.markdown = data;
      },
      error: (error) => {
        console.error('Error loading changelog:', error);
      },
    });
  }
}
