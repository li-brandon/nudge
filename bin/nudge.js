#!/usr/bin/env node

import { program } from 'commander';
import { install } from '../lib/install.js';
import { uninstall } from '../lib/uninstall.js';
import { update } from '../lib/update.js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const pkg = JSON.parse(readFileSync(join(__dirname, '..', 'package.json'), 'utf-8'));

program
  .name('nudge')
  .description('AI-powered coding mentor that guides with questions, not answers - for OpenCode and GitHub Copilot')
  .version(pkg.version);

program
  .command('install')
  .description('Install the Learn agent')
  .option('--no-tui', 'Non-interactive mode with defaults')
  .option('--opencode', 'Install for OpenCode only')
  .option('--copilot', 'Install for GitHub Copilot only')
  .option('--all', 'Install for all platforms without prompting')
  .option('--model <model>', 'Model to use for OpenCode (e.g., anthropic/claude-sonnet-4)')
  .option('--color <hex>', 'Agent color for OpenCode in hex format (e.g., #14B8A6)')
  .action(install);

program
  .command('uninstall')
  .description('Remove the Learn agent from all installed platforms')
  .option('--force', 'Skip confirmation prompt')
  .action(uninstall);

program
  .command('update')
  .description('Update the Learn agent to the latest version')
  .option('--preserve-config', 'Keep existing model and color settings (OpenCode only)')
  .action(update);

program.parse();
