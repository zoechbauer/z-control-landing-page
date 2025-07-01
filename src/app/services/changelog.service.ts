import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface ChangelogEntry {
  version: string;
  date: string;
  added?: string[];
  fixed?: string[];
  improved?: string[];
  features?: string[];
}

@Injectable({
  providedIn: 'root',
})
export class ChangelogService {
  constructor(private http: HttpClient) {}

  getChangelog(): Observable<string> {
    return this.http.get('/assets/CHANGELOG.md', { responseType: 'text' });
  }

  getLatestChanges(limit: number = 3): Observable<ChangelogEntry[]> {
    return this.getChangelog().pipe(
      map((content) => this.parseChangelog(content, limit))
    );
  }

  private parseChangelog(content: string, limit: number): ChangelogEntry[] {
    const entries: ChangelogEntry[] = [];
    const lines = content.split('\n');
    let currentEntry: ChangelogEntry | null = null;
    let currentSection: string | null = null;

    for (const line of lines) {
      // Version header: ## [1.1] - 2025-07-01
      const versionMatch = line.match(/^## \[(.+?)\] - (.+)$/);
      if (versionMatch) {
        if (currentEntry) {
          entries.push(currentEntry);
        }
        currentEntry = {
          version: versionMatch[1],
          date: versionMatch[2],
          added: [],
          fixed: [],
          improved: [],
          features: [],
        };
        currentSection = null;
        continue;
      }

      // Section headers: ### Added, ### Fixed, etc.
      const sectionMatch = line.match(/^### (.+)$/);
      if (sectionMatch && currentEntry) {
        currentSection = sectionMatch[1].toLowerCase();
        continue;
      }

      // List items: - Something
      const itemMatch = line.match(/^- (.+)$/);
      if (itemMatch && currentEntry && currentSection) {
        const item = itemMatch[1];
        switch (currentSection) {
          case 'added':
            currentEntry.added!.push(item);
            break;
          case 'fixed':
            currentEntry.fixed!.push(item);
            break;
          case 'improved':
            currentEntry.improved!.push(item);
            break;
          case 'features':
            currentEntry.features!.push(item);
            break;
        }
      }
    }

    if (currentEntry) {
      entries.push(currentEntry);
    }

    return entries.slice(0, limit);
  }
}
