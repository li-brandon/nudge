import { homedir } from 'os';
import { join } from 'path';

// OpenCode configuration paths
export const OPENCODE_CONFIG_DIR = join(homedir(), '.config', 'opencode');
export const OPENCODE_AGENTS_DIR = join(OPENCODE_CONFIG_DIR, 'agents');
export const OPENCODE_LEARN_AGENT_PATH = join(OPENCODE_AGENTS_DIR, 'learn.md');

// GitHub Copilot configuration paths (relative to current working directory)
export const COPILOT_AGENTS_DIR = join(process.cwd(), '.github', 'agents');
export const COPILOT_LEARN_AGENT_PATH = join(COPILOT_AGENTS_DIR, 'learn.agent.md');

// Legacy exports for backwards compatibility
export const AGENTS_DIR = OPENCODE_AGENTS_DIR;
export const LEARN_AGENT_PATH = OPENCODE_LEARN_AGENT_PATH;

// Default color for the Learn agent (OpenCode only)
export const DEFAULT_COLOR = '#14B8A6';

// Platform options
export const PLATFORM_OPTIONS = [
  { value: 'both', label: 'Both (recommended)', hint: 'Install for OpenCode and GitHub Copilot' },
  { value: 'opencode', label: 'OpenCode only', hint: 'Install to ~/.config/opencode/agents/' },
  { value: 'copilot', label: 'GitHub Copilot only', hint: 'Install to .github/agents/ in current directory' },
];

// Color options for interactive selection (OpenCode only)
export const COLOR_OPTIONS = [
  { value: '#14B8A6', label: 'Teal (#14B8A6)', hint: 'recommended' },
  { value: '#10B981', label: 'Emerald (#10B981)' },
  { value: '#06B6D4', label: 'Cyan (#06B6D4)' },
  { value: '#0EA5E9', label: 'Sky Blue (#0EA5E9)' },
];

// Model options for interactive selection (OpenCode only)
export const MODEL_OPTIONS = [
  { value: '', label: 'Use OpenCode default', hint: 'recommended' },
  { value: 'anthropic/claude-sonnet-4', label: 'anthropic/claude-sonnet-4' },
  { value: 'anthropic/claude-opus-4', label: 'anthropic/claude-opus-4' },
  { value: 'openai/gpt-4o', label: 'openai/gpt-4o' },
  { value: 'google/gemini-2.0-flash', label: 'google/gemini-2.0-flash' },
];

/**
 * Validates a hex color string
 * @param {string} color - The color to validate
 * @returns {boolean} - True if valid hex color
 */
export function isValidHexColor(color) {
  return /^#[0-9a-fA-F]{6}$/.test(color);
}

/**
 * Parses the frontmatter from a markdown file
 * @param {string} content - The markdown content
 * @returns {{ frontmatter: object, body: string }} - Parsed frontmatter and body
 */
export function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) {
    return { frontmatter: {}, body: content };
  }

  const frontmatterStr = match[1];
  const body = match[2];

  // Simple YAML-like parsing for frontmatter
  const frontmatter = {};
  const lines = frontmatterStr.split('\n');
  
  for (const line of lines) {
    const colonIndex = line.indexOf(':');
    if (colonIndex === -1) continue;
    
    const key = line.slice(0, colonIndex).trim();
    let value = line.slice(colonIndex + 1).trim();
    
    // Handle quoted strings
    if ((value.startsWith('"') && value.endsWith('"')) || 
        (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    
    // Handle booleans
    if (value === 'true') value = true;
    if (value === 'false') value = false;
    
    // Handle numbers
    if (!isNaN(value) && value !== '') {
      value = parseFloat(value);
    }
    
    frontmatter[key] = value;
  }

  return { frontmatter, body };
}

/**
 * Serializes frontmatter back to YAML format
 * @param {object} frontmatter - The frontmatter object
 * @returns {string} - YAML string
 */
export function serializeFrontmatter(frontmatter) {
  const lines = [];
  
  for (const [key, value] of Object.entries(frontmatter)) {
    if (value === undefined || value === null) continue;
    
    if (typeof value === 'string') {
      // Quote strings that contain special characters or look like other types
      if (value.includes(':') || value.includes('#') || value.startsWith('"') || 
          value === 'true' || value === 'false' || !isNaN(value)) {
        lines.push(`${key}: "${value}"`);
      } else {
        lines.push(`${key}: ${value}`);
      }
    } else if (typeof value === 'boolean' || typeof value === 'number') {
      lines.push(`${key}: ${value}`);
    } else if (typeof value === 'object') {
      // Handle nested objects (like tools, permission)
      lines.push(`${key}:`);
      for (const [subKey, subValue] of Object.entries(value)) {
        lines.push(`  ${subKey}: ${subValue}`);
      }
    }
  }
  
  return lines.join('\n');
}

/**
 * Updates specific fields in the frontmatter while preserving the rest
 * @param {string} content - The markdown content
 * @param {object} updates - Fields to update
 * @returns {string} - Updated markdown content
 */
export function updateFrontmatter(content, updates) {
  const { frontmatter, body } = parseFrontmatter(content);
  
  // Apply updates
  for (const [key, value] of Object.entries(updates)) {
    if (value === undefined || value === '') {
      delete frontmatter[key];
    } else {
      frontmatter[key] = value;
    }
  }
  
  const newFrontmatter = serializeFrontmatter(frontmatter);
  return `---\n${newFrontmatter}\n---\n${body}`;
}
