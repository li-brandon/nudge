import * as p from '@clack/prompts';
import pc from 'picocolors';
import { existsSync, readFileSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import {
  OPENCODE_LEARN_AGENT_PATH,
  COPILOT_LEARN_AGENT_PATH,
  DEFAULT_COLOR,
  COLOR_OPTIONS,
  MODEL_OPTIONS,
  isValidHexColor,
  parseFrontmatter,
  updateFrontmatter,
} from './utils.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Get the path to the OpenCode agent template
 */
function getOpenCodeTemplatePath() {
  return join(__dirname, '..', 'agents', 'learn.md');
}

/**
 * Get the path to the GitHub Copilot agent template
 */
function getCopilotTemplatePath() {
  return join(__dirname, '..', 'agents', 'learn.copilot.md');
}

/**
 * Update the Learn agent to the latest version
 * @param {object} options - CLI options
 */
export async function update(options) {
  p.intro(pc.bgCyan(pc.black(' nudge ')));

  // Detect installed platforms
  const installations = [];

  if (existsSync(OPENCODE_LEARN_AGENT_PATH)) {
    installations.push({
      platform: 'OpenCode',
      path: OPENCODE_LEARN_AGENT_PATH,
      templatePath: getOpenCodeTemplatePath(),
    });
  }

  if (existsSync(COPILOT_LEARN_AGENT_PATH)) {
    installations.push({
      platform: 'GitHub Copilot',
      path: COPILOT_LEARN_AGENT_PATH,
      templatePath: getCopilotTemplatePath(),
    });
  }

  // Check if any installations were found
  if (installations.length === 0) {
    p.log.warning('Learn agent is not installed on any platform.');
    p.log.info('Run `bunx nudge install` to install it first.');
    p.outro('Update cancelled.');
    process.exit(0);
  }

  // Show found installations
  p.log.info('Found Learn agent installations:');
  for (const { platform, path } of installations) {
    p.log.message(`  ${pc.cyan(platform)}: ${path}`);
  }

  const s = p.spinner();
  const updated = [];
  const errors = [];

  for (const { platform, path, templatePath } of installations) {
    try {
      // Read current configuration (for OpenCode, preserve model/color if requested)
      let currentConfig = {};
      if (platform === 'OpenCode' && options.preserveConfig) {
        const currentContent = readFileSync(path, 'utf-8');
        const { frontmatter } = parseFrontmatter(currentContent);
        currentConfig = {
          model: frontmatter.model || '',
          color: frontmatter.color?.replace(/"/g, '') || DEFAULT_COLOR,
        };
        p.log.info(`Preserving OpenCode configuration:`);
        p.log.message(`  Model: ${currentConfig.model || 'OpenCode default'}`);
        p.log.message(`  Color: ${currentConfig.color}`);
      }

      // Read the latest template
      if (!existsSync(templatePath)) {
        throw new Error(`Template not found at ${templatePath}`);
      }

      s.start(`Updating ${platform}...`);

      let content = readFileSync(templatePath, 'utf-8');

      // Apply preserved configuration (OpenCode only)
      if (platform === 'OpenCode' && options.preserveConfig && currentConfig.color) {
        const updates = {
          color: `"${currentConfig.color}"`,
        };
        if (currentConfig.model) {
          updates.model = currentConfig.model;
        }
        content = updateFrontmatter(content, updates);
      }

      // Write the updated agent file
      writeFileSync(path, content, 'utf-8');
      updated.push(platform);
      s.stop(`${platform} updated.`);

    } catch (error) {
      s.stop(`${platform} update failed.`);
      errors.push({ platform, error: error.message });
    }
  }

  // Show results
  if (updated.length > 0) {
    p.log.success(`Updated: ${updated.join(', ')}`);
  }

  if (errors.length > 0) {
    for (const { platform, error } of errors) {
      p.log.error(`Failed to update ${platform}: ${error}`);
    }
  }

  if (updated.length === installations.length) {
    p.outro(pc.green('Learn agent updated on all platforms.'));
  } else if (updated.length > 0) {
    p.outro(pc.yellow('Learn agent partially updated.'));
  } else {
    p.outro(pc.red('Failed to update Learn agent.'));
    process.exit(1);
  }
}
