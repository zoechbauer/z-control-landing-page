import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface ChangelogItem {
  text: string;
  children?: ChangelogItem[];
}

export interface ChangelogEntry {
  version: string;
  date: string;
  added?: ChangelogItem[];
  fixed?: ChangelogItem[];
  improved?: ChangelogItem[];
  features?: ChangelogItem[];
}

@Injectable({
  providedIn: 'root',
})
export class ChangelogService {
  constructor(private http: HttpClient) {}

  getChangelog(): Observable<string> {
    return this.http.get('assets/CHANGELOG.md', { responseType: 'text' });
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
    let currentItems: ChangelogItem[] = [];
    let lineIndex = 0;

    while (lineIndex < lines.length) {
      const line = lines[lineIndex];
      const trimmedLine = line.trim();

      // Check for version header
      const versionEntry = this.parseVersionHeader(trimmedLine);
      if (versionEntry) {
        if (currentEntry) {
          this.finalizeSectionItems(currentEntry, currentSection, currentItems);
          entries.push(currentEntry);
        }
        currentEntry = versionEntry;
        currentSection = null;
        currentItems = [];
        lineIndex++;
        continue;
      }

      // Check for section header
      const newSection = this.parseSectionHeader(trimmedLine, currentEntry);
      if (newSection !== null) {
        console.log('Found section:', newSection);
        // Finalize previous section
        this.finalizeSectionItems(currentEntry, currentSection, currentItems);
        currentSection = newSection;
        currentItems = [];
        lineIndex++;
        continue;
      }

      // Check for list item
      const listItem = this.parseListItemWithNesting(line, lines, lineIndex);
      if (listItem && currentEntry && currentSection) {
        currentItems.push(listItem.item);
        lineIndex = listItem.nextIndex;
      } else {
        lineIndex++;
      }
    }

    // Finalize last entry
    if (currentEntry) {
      this.finalizeSectionItems(currentEntry, currentSection, currentItems);
      entries.push(currentEntry);
    }

    console.log(
      'Final parsed entries:',
      entries.length,
      'entries with sections:',
      entries.map((e) => ({
        version: e.version,
        sections: {
          added: e.added?.length || 0,
          fixed: e.fixed?.length || 0,
          improved: e.improved?.length || 0,
          features: e.features?.length || 0,
        },
      }))
    );

    return entries.slice(0, limit);
  }

  private parseVersionHeader(line: string): ChangelogEntry | null {
    const versionMatch = line.match(/^## \[(.+?)\] - (.+)$/);
    if (versionMatch) {
      return {
        version: versionMatch[1].trim(),
        date: versionMatch[2].trim(),
        added: [],
        fixed: [],
        improved: [],
        features: [],
      };
    }
    return null;
  }

  private parseSectionHeader(
    line: string,
    currentEntry: ChangelogEntry | null
  ): string | null {
    const sectionMatch = line.match(/^### (.+)$/);
    if (sectionMatch && currentEntry) {
      return this.mapSectionToProperty(sectionMatch[1].toLowerCase());
    }
    return null;
  }

  private mapSectionToProperty(sectionText: string): string | null {
    // Make matching more robust by checking text content regardless of emojis
    const lowerText = sectionText.toLowerCase();

    if (
      lowerText.includes('new features') ||
      lowerText.includes('✨') ||
      lowerText.includes('features')
    ) {
      return 'added';
    }
    if (
      lowerText.includes('fixes') ||
      lowerText.includes('🐛') ||
      lowerText.includes('fix')
    ) {
      return 'fixed';
    }
    if (
      lowerText.includes('improvements') ||
      lowerText.includes('🚀') ||
      lowerText.includes('improvement')
    ) {
      return 'improved';
    }
    if (
      lowerText.includes('initial release') ||
      lowerText.includes('🎉') ||
      lowerText.includes('release')
    ) {
      return 'features';
    }

    return null;
  }

  private parseListItem(
    line: string,
    currentEntry: ChangelogEntry | null,
    currentSection: string | null
  ): void {
    // This method is deprecated - using parseListItemWithNesting instead
  }

  private parseListItemWithNesting(
    line: string,
    lines: string[],
    startIndex: number
  ): { item: ChangelogItem; nextIndex: number } | null {
    // Trim the line and check for list item pattern
    const trimmedLine = line.trim();
    if (!trimmedLine.startsWith('- ')) {
      return null;
    }

    // Extract content after "- "
    let content = trimmedLine.substring(2).trim();
    if (!content) {
      return null;
    }

    console.log('Found list item:', content);

    const text = this.convertMarkdownToHtml(content);
    const item: ChangelogItem = { text, children: [] };
    let nextIndex = startIndex + 1;

    // Look for nested items (lines that start with spaces and -)
    while (nextIndex < lines.length) {
      const nextLine = lines[nextIndex];
      const trimmedNextLine = nextLine.trim();

      // Check for nested item (starts with spaces followed by dash)
      if (nextLine.match(/^\s+- /)) {
        const nestedContent = trimmedNextLine.substring(2).trim();
        if (nestedContent) {
          console.log('Found nested item:', nestedContent);
          const nestedText = this.convertMarkdownToHtml(nestedContent);
          item.children!.push({ text: nestedText });
        }
        nextIndex++;
      } else if (trimmedNextLine === '') {
        // Skip empty lines
        nextIndex++;
      } else {
        // Not a nested item or empty line, stop processing
        break;
      }
    }

    return { item, nextIndex };
  }

  private finalizeSectionItems(
    entry: ChangelogEntry | null,
    section: string | null,
    items: ChangelogItem[]
  ): void {
    if (!entry || !section || items.length === 0) {
      return;
    }

    switch (section) {
      case 'added':
        entry.added = [...items];
        break;
      case 'fixed':
        entry.fixed = [...items];
        break;
      case 'improved':
        entry.improved = [...items];
        break;
      case 'features':
        entry.features = [...items];
        break;
    }
  }

  private convertMarkdownToHtml(text: string): string {
    // Convert **text** to <strong>text</strong>
    return text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  }
}
