import AxeBuilder from '@axe-core/playwright';
import { Page } from '@playwright/test';

export interface A11yOptions {
  rules?: string[];
  tags?: string[];
}

export async function runAccessibilityScan(page: Page, options: A11yOptions = {}) {
  const builder = new AxeBuilder({ page });

  if (options.tags) {
    builder.withTags(options.tags);
  } else {
    builder.withTags(['wcag2a', 'wcag2aa']);
  }

  if (options.rules) {
    builder.withRules(options.rules);
  }

  return builder.analyze();
}
