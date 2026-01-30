# nudge

> AI-powered coding mentor that guides with questions, not answers.

Based on the **OwnYourCode** methodology - the Learn agent helps you become a better developer by teaching through Socratic dialogue, not code generation.

## Supported Platforms

- **OpenCode** - Installs to `~/.config/opencode/agents/learn.md`
- **GitHub Copilot** - Installs to `.github/agents/learn.agent.md` in your project

## Philosophy

> "If you took away the AI tomorrow, could this developer still code?"

The Learn agent's job is to make the answer **YES**.

Unlike traditional AI coding assistants that write code for you, the Learn agent:

- **Teaches** through questions, not answers
- **Guides** you to solutions instead of providing them
- **Reviews** your code through 6 quality gates
- **Refuses** to write production code for you

## Installation

```bash
bunx nudge install
```

This will prompt you to choose which platform(s) to install for.

### Platform-Specific Installation

```bash
# Interactive (prompts for platform selection)
bunx nudge install

# OpenCode only
bunx nudge install --opencode

# GitHub Copilot only
bunx nudge install --copilot

# Both platforms
bunx nudge install --all
```

### Non-Interactive Installation

```bash
# Install with defaults (no prompts)
bunx nudge install --no-tui

# Install with specific options (OpenCode only)
bunx nudge install --opencode --model anthropic/claude-sonnet-4 --color "#14B8A6"
```

## Commands

| Command | Description |
|---------|-------------|
| `bunx nudge install` | Install the Learn agent |
| `bunx nudge uninstall` | Remove the Learn agent from all platforms |
| `bunx nudge update` | Update to the latest version |

### Install Options

| Option | Description |
|--------|-------------|
| `--opencode` | Install for OpenCode only |
| `--copilot` | Install for GitHub Copilot only |
| `--all` | Install for all platforms without prompting |
| `--no-tui` | Non-interactive mode with defaults |
| `--model <model>` | Specify model for OpenCode (e.g., `anthropic/claude-sonnet-4`) |
| `--color <hex>` | Specify color for OpenCode (e.g., `#14B8A6`) |

### Uninstall Options

| Option | Description |
|--------|-------------|
| `--force` | Skip confirmation prompt |

### Update Options

| Option | Description |
|--------|-------------|
| `--preserve-config` | Keep existing model and color settings (OpenCode only) |

## The 4 Non-Negotiable Protocols

### Protocol A: Active Typist
**You write ALL production code.** The Learn agent provides guidance and examples (max 8 lines), but never writes full implementations.

### Protocol B: Socratic Teaching
**Never give the answer if a question can lead there.** Instead of "The bug is on line 42", it asks "What do you expect to happen on line 42?"

### Protocol C: Evidence-Based Engineering
**We verify, never guess.** The agent checks documentation before answering and teaches you to do the same.

### Protocol D: Stuck Framework
**Systematic debugging guidance.** When stuck, the agent guides you through: READ -> ISOLATE -> DOCS -> HYPOTHESIZE -> VERIFY.

## The 6 Mentorship Gates

Before any task is complete, the Learn agent guides you through:

1. **Ownership** - Can you explain your code line by line?
2. **Security** - Where does user input enter? How is it validated?
3. **Error Handling** - What happens when things fail?
4. **Performance** - What happens at scale?
5. **Fundamentals** - Would a new developer understand this?
6. **Testing** - What tests prove this works?

## Learning Modes

- **Quiz Mode** - "Quiz me on [topic]"
- **Learning Roadmap** - "Create a learning plan for [skill]"
- **Code Review** - Share your code for guided review
- **Concept Explanation** - Learn new concepts through analogies
- **Documentation Summary** - Get plain-language summaries of docs

## Color Options (OpenCode Only)

The Learn agent comes with several color presets:

| Color | Hex | Description |
|-------|-----|-------------|
| Teal | `#14B8A6` | Default - wisdom + growth |
| Emerald | `#10B981` | Growth and progress |
| Cyan | `#06B6D4` | Curiosity and clarity |
| Sky Blue | `#0EA5E9` | Knowledge and learning |

## Requirements

- [Bun](https://bun.sh) runtime (for installation)
- One of the following:
  - [OpenCode](https://opencode.ai) installed and configured
  - [GitHub Copilot](https://github.com/features/copilot) subscription

## Manual Installation

### OpenCode

1. Download `agents/learn.md` from this repository
2. Place it in `~/.config/opencode/agents/learn.md`
3. Start OpenCode and select the "Learn" agent

### GitHub Copilot

1. Download `agents/learn.copilot.md` from this repository
2. Place it in your project's `.github/agents/learn.agent.md`
3. Commit and push to your repository
4. The Learn agent will appear in the Copilot agent dropdown

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT - see [LICENSE](LICENSE) for details.

## Acknowledgments

Based on the **OwnYourCode** methodology for building better engineers through mentorship rather than code generation.
