import * as p from '@clack/prompts';
import pc from 'picocolors';
import { existsSync, unlinkSync } from 'fs';
import {
  OPENCODE_LEARN_AGENT_PATH,
  COPILOT_LEARN_AGENT_PATH,
} from './utils.js';

/**
 * Uninstall the Learn agent from all installed platforms
 * @param {object} options - CLI options
 */
export async function uninstall(options) {
  p.intro(pc.bgCyan(pc.black(' nudge ')));

  // Detect installed platforms
  const installations = [];

  if (existsSync(OPENCODE_LEARN_AGENT_PATH)) {
    installations.push({
      platform: 'OpenCode',
      path: OPENCODE_LEARN_AGENT_PATH,
    });
  }

  if (existsSync(COPILOT_LEARN_AGENT_PATH)) {
    installations.push({
      platform: 'GitHub Copilot',
      path: COPILOT_LEARN_AGENT_PATH,
    });
  }

  // Check if any installations were found
  if (installations.length === 0) {
    p.log.warning('Learn agent is not installed on any platform.');
    p.outro('Nothing to uninstall.');
    process.exit(0);
  }

  // Show found installations
  p.log.info('Found Learn agent installations:');
  for (const { platform, path } of installations) {
    p.log.message(`  ${pc.cyan(platform)}: ${path}`);
  }

  // Confirm uninstallation
  if (!options.force) {
    const confirm = await p.confirm({
      message: `Remove ${installations.length === 1 ? 'this installation' : 'all installations'}?`,
      initialValue: false,
    });

    if (p.isCancel(confirm) || !confirm) {
      p.cancel('Uninstallation cancelled.');
      process.exit(0);
    }
  }

  const s = p.spinner();
  s.start('Removing Learn agent...');

  const removed = [];
  const errors = [];

  for (const { platform, path } of installations) {
    try {
      unlinkSync(path);
      removed.push(platform);
    } catch (error) {
      errors.push({ platform, error: error.message });
    }
  }

  s.stop('Done.');

  // Show results
  if (removed.length > 0) {
    p.log.success(`Removed from: ${removed.join(', ')}`);
  }

  if (errors.length > 0) {
    for (const { platform, error } of errors) {
      p.log.error(`Failed to remove from ${platform}: ${error}`);
    }
  }

  if (removed.length === installations.length) {
    p.outro(pc.green('Learn agent removed from all platforms.'));
  } else if (removed.length > 0) {
    p.outro(pc.yellow('Learn agent partially removed.'));
  } else {
    p.outro(pc.red('Failed to remove Learn agent.'));
    process.exit(1);
  }
}
