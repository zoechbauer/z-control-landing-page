import { Component, OnInit } from '@angular/core';
import { PrivacyService } from '../../services/privacy.service';
import { CommonModule } from '@angular/common';
import { IonContent, IonButton } from '@ionic/angular/standalone';

@Component({
  selector: 'app-privacy-debug',
  template: `
    <ion-content class="ion-padding">
      <h1>Privacy Service Debug</h1>

      <div *ngFor="let test of testResults">
        <h3>{{ test.name }}</h3>
        <p><strong>Status:</strong> {{ test.status }}</p>
        <p><strong>Result:</strong></p>
        <pre>{{ test.result | json }}</pre>
        <hr />
      </div>

      <ion-button (click)="runTests()" fill="outline"> Run Tests </ion-button>
    </ion-content>
  `,
  standalone: true,
  imports: [CommonModule, IonContent, IonButton],
})
export class PrivacyDebugComponent implements OnInit {
  testResults: any[] = [];

  constructor(private privacyService: PrivacyService) {}

  ngOnInit() {
    this.runTests();
  }

  async runTests() {
    this.testResults = [];

    // Test 1: Get available policies
    try {
      const policies = await this.privacyService
        .getAvailablePolicies()
        .toPromise();
      this.testResults.push({
        name: 'Get Available Policies',
        status: 'SUCCESS',
        result: policies,
      });
    } catch (error) {
      this.testResults.push({
        name: 'Get Available Policies',
        status: 'ERROR',
        result: error,
      });
    }

    // Test 2: Get basic English policy
    try {
      const policy = await this.privacyService
        .getPolicy('basic', 'en')
        .toPromise();
      this.testResults.push({
        name: 'Get Basic EN Policy',
        status: 'SUCCESS',
        result: {
          title: policy?.title,
          language: policy?.language,
          type: policy?.type,
          contentLength: policy?.content?.length || 0,
          contentPreview: policy?.content?.substring(0, 200) + '...',
        },
      });
    } catch (error) {
      this.testResults.push({
        name: 'Get Basic EN Policy',
        status: 'ERROR',
        result: error,
      });
    }

    // Test 3: Get basic German policy
    try {
      const policy = await this.privacyService
        .getPolicy('basic', 'de')
        .toPromise();
      this.testResults.push({
        name: 'Get Basic DE Policy',
        status: 'SUCCESS',
        result: {
          title: policy?.title,
          language: policy?.language,
          type: policy?.type,
          contentLength: policy?.content?.length || 0,
          contentPreview: policy?.content?.substring(0, 200) + '...',
        },
      });
    } catch (error) {
      this.testResults.push({
        name: 'Get Basic DE Policy',
        status: 'ERROR',
        result: error,
      });
    }

    // Test 4: Get default policy
    try {
      const policy = await this.privacyService.getDefaultPolicy().toPromise();
      this.testResults.push({
        name: 'Get Default Policy',
        status: 'SUCCESS',
        result: {
          title: policy?.title,
          language: policy?.language,
          type: policy?.type,
          contentLength: policy?.content?.length || 0,
        },
      });
    } catch (error) {
      this.testResults.push({
        name: 'Get Default Policy',
        status: 'ERROR',
        result: error,
      });
    }
  }
}
