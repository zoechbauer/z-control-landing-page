import { Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonButton, IonIcon } from '@ionic/angular/standalone';
import {
  REPO,
  GithubAnalyticsTrafficDocument,
} from '@app/shared/GitHubConstants';

import { FirebaseAnalyticsService } from '@app/services/firebase-analytics.service';
import { UtilsService } from '@app/services/utils.service';

@Component({
  selector: 'app-github-analytics-details',
  templateUrl: './github-analytics-details.component.html',
  styleUrls: ['./github-analytics-details.component.scss'],
  standalone: true,
  imports: [CommonModule, IonButton, IonIcon],
})
export class GithubAnalyticsDetailsComponent {
  @Input() item!: GithubAnalyticsTrafficDocument;
  @Input() analyticsData!: GithubAnalyticsTrafficDocument[];
  @Input() githubTrafficData!: GithubAnalyticsTrafficDocument[];

  readonly utilsService = inject(UtilsService);
  private readonly fa = inject(FirebaseAnalyticsService);

  totalCountLength = 5; // Total length for count display, including leading blanks

  /**
   * Returns the total views count for a repository.
   * @param item - The analytics document for the repository.
   * @returns Total views count.
   */
  getViewsTotalCount(item: GithubAnalyticsTrafficDocument): number {
    return item.views.views.reduce((sum, v) => sum + v.count, 0);
  }

  /**
   * Returns the total unique views for a repository.
   * @param item - The analytics document for the repository.
   * @returns Total unique views count.
   */
  getViewsTotalUniques(item: GithubAnalyticsTrafficDocument): number {
    return item.views.views.reduce((sum, v) => sum + v.uniques, 0);
  }

  /**
   * Returns the total clones count for a repository.
   * @param item - The analytics document for the repository.
   * @returns Total clones count.
   */
  getClonesTotalCount(item: GithubAnalyticsTrafficDocument): number {
    return item.clones.clones.reduce((sum, c) => sum + c.count, 0);
  }

  /**
   * Returns the total unique clones for a repository.
   * @param item - The analytics document for the repository.
   * @returns Total unique clones count.
   */
  getClonesTotalUniques(item: GithubAnalyticsTrafficDocument): number {
    return item.clones.clones.reduce((sum, c) => sum + c.uniques, 0);
  }

  /**
   * Gets the oldest timestamp from views and clones data.
   * @param item - The analytics document for the repository.
   * @returns The oldest Date or null if no data.
   */
  getOldestItem(item: GithubAnalyticsTrafficDocument): Date | null {
    const allTimestamps = [
      ...item.views.views.map((v) => v.timestamp),
      ...item.clones.clones.map((c) => c.timestamp),
    ];
    if (allTimestamps.length === 0) return null;
    const oldest = allTimestamps.reduce(
      (min, ts) => (new Date(ts) < new Date(min) ? ts : min),
      allTimestamps[0],
    );
    return new Date(oldest);
  }

  /**
   * Gets the most recent timestamp from views and clones data.
   * @param item - The analytics document for the repository.
   * @returns The most recent Date or null if no data.
   */
  getMostRecentItem(item: GithubAnalyticsTrafficDocument): Date | null {
    const allTimestamps = [
      ...item.views.views.map((v) => v.timestamp),
      ...item.clones.clones.map((c) => c.timestamp),
    ];
    if (allTimestamps.length === 0) return null;
    const newest = allTimestamps.reduce(
      (max, ts) => (new Date(ts) > new Date(max) ? ts : max),
      allTimestamps[0],
    );
    return new Date(newest);
  }

  /**
   * Returns the number of days since the last access for a repository.
   * Dates are normalized to midnight to avoid partial day differences.
   * @param item - The analytics document for the repository.
   * @returns Number of days since the last access, or null if no data is available.
   */
  getLastAccessDays(item: GithubAnalyticsTrafficDocument): number | null {
    const mostRecent = this.getMostRecentItem(item);
    if (!mostRecent) return null;

    const mostRecentDate = new Date(mostRecent).setHours(0, 0, 0, 0);
    const lastUpdate = new Date(item.timestamp).setHours(0, 0, 0, 0);

    const diffTime = Math.abs(lastUpdate - mostRecentDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }

  /**
   * Gets the last access time formatted as a human-readable string.
   * @param item - The analytics document for the repository.
   * @returns A string representing the last access time, e.g., "3 days ago" or "1 day ago".
   */
  getFormattedLastAccessDays(item: GithubAnalyticsTrafficDocument): string {
    const lastAccessDays = this.getLastAccessDays(item);
    const daysAgo =
      lastAccessDays !== null && lastAccessDays > 1 ? 'days ago' : 'day ago';
    return lastAccessDays !== null ? `${lastAccessDays} ${daysAgo}` : '';
  }

  /**
   * Gets the first access time formatted as a human-readable string in days 
   * (if less than 1 month) or months.
   * @param item - The analytics document for the repository.
   * @returns A string representing the first access time, e.g., "3 months ago" or "1 day ago".
   */
  getFormattedFirstAccessDays(item: GithubAnalyticsTrafficDocument): string {
    const oldestItem = this.getOldestItem(item);
    if (!oldestItem) return '';

    const oldestDate = new Date(oldestItem).setHours(0, 0, 0, 0);
    const lastUpdate = new Date(item.timestamp).setHours(0, 0, 0, 0);

    const diffTime = Math.abs(lastUpdate - oldestDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const daysAgo = diffDays > 1 ? 'days ago' : 'day ago';

    const diffMonths = Math.floor(diffDays / 30);
    const monthsAgo = diffMonths > 1 ? 'months ago' : 'month ago';

    if (diffMonths >= 1) {
      return `= ${diffMonths} ${monthsAgo}`;
    } else {
      return `= ${diffDays} ${daysAgo}`;
    }
  }

  /**
   * Opens the GitHub Analytics help document for the given repository as markdown.
   * @param repo - The repository name.
   */
  async onOpenGithubAnalyticsHelp(repo: (typeof REPO)[keyof typeof REPO]) {
    try {
      const docPath =
        'assets/app-docs/backend-functions-app/github-analytics-help.md';
      await this.utilsService.openMarkdownDoc(docPath);
      this.fa.logEvent('get_github_analytics_help', {
        repo: repo,
        app: REPO.Z_CONTROL_LANDING_PAGE,
      });
    } catch (error) {
      console.error('Error opening GitHub Analytics help document:', error);
    }
  }

  /**
   * Opens the GitHub source code page for the given repository in a new tab and logs the event.
   * @param repo - The repository name.
   */
  onGetSourceCode(repo: (typeof REPO)[keyof typeof REPO]) {
    try {
      globalThis.window.open(this.getSourceCodeUrl(repo), '_blank');
      this.fa.logEvent('get_source_code', {
        repo: repo,
        app: REPO.Z_CONTROL_LANDING_PAGE,
      });
    } catch (error) {
      console.error('Error opening source code URL:', error);
    }
  }

  /**
   * Gets the URL of the GitHub source code page for the given repository.
   * @param repo - The repository name.
   * @returns The URL of the GitHub source code page.
   */
  private getSourceCodeUrl(repo: (typeof REPO)[keyof typeof REPO]): string {
    return `https://github.com/zoechbauer/${repo}`;
  }
}
