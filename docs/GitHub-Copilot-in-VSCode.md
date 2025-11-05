# GitHub Copilot in VS Code

A comprehensive guide to using GitHub Copilot effectively in Visual Studio Code, covering all modes, features, and best practices.

## 📋 Table of Contents

- [Subscription Overview](#subscription-overview)
- [Copilot Modes Explained](#copilot-modes-explained)
- [Required VS Code Extensions](#required-vs-code-extensions)
- [Cloud vs Local Execution](#cloud-vs-local-execution)
- [Model Selection Guide](#model-selection-guide)
- [Managing Models](#managing-models)
- [Context Variables (# Commands)](#context-variables--commands)
- [Recommended Tutorials](#recommended-tutorials)
- [Best Practices](#best-practices)

---

## 💳 Subscription Overview

### GitHub Copilot Individual ($100/year)

Your subscription includes:

- ✅ **Code Completion**: Inline suggestions as you type
- ✅ **Chat Interface**: Ask questions and get AI-powered answers
- ✅ **Code Editing**: Multi-file editing with AI assistance
- ✅ **Workspace Agent**: Project-wide code understanding (beta)
- ✅ **Command Palette Integration**: Quick actions via Ctrl+Shift+P
- ✅ **Multiple AI Models**: Access to GPT-4, GPT-3.5, Claude, and more

**Note**: Some advanced features like Copilot Edits and Agents may require GitHub Copilot Business ($19/user/month) or Enterprise subscription.

---

## 🎯 Copilot Modes Explained

GitHub Copilot in VS Code offers several interaction modes, each designed for different workflows:

### 1. **Inline Suggestions Mode** (Default)

**What it is**: AI-powered code completions as you type, similar to IntelliSense but smarter.

**How to use**:

- Simply start typing code
- Copilot suggests completions in gray text
- Press `Tab` to accept, `Esc` to dismiss
- Press `Alt + ]` for next suggestion, `Alt + [` for previous

**Best for**:

- Writing boilerplate code
- Implementing common patterns
- Autocompleting repetitive tasks

**Example**:

```typescript
// Start typing:
function calculateTax
// Copilot suggests:
function calculateTax(amount: number, rate: number): number {
  return amount * rate;
}
```

---

### 2. **Chat Mode** (Ask/Conversational)

**What it is**: Interactive chat interface for asking questions and getting explanations.

**How to access**:

- Click the Copilot icon in the Activity Bar (left sidebar)
- Or use keyboard shortcut: `Ctrl + Alt + I` (Windows/Linux) or `Cmd + Shift + I` (Mac)
- Or open Command Palette (`Ctrl+Shift+P`) → "GitHub Copilot: Open Chat"

**Features**:

- Ask questions about your code
- Request explanations
- Get debugging help
- Ask for code examples
- Multi-turn conversations with context

**Best for**:

- Learning how code works
- Debugging issues
- Exploring new APIs
- Getting quick answers

**Example Questions**:

```
"How does async/await work in TypeScript?"
"Explain this error: Cannot find module 'firebase/analytics'"
"What's the difference between BehaviorSubject and Subject in RxJS?"
"How do I test Firebase functions in Karma?"
```

---

### 3. **Edit Mode** (Inline Editing)

**What it is**: AI-powered code editing directly in your editor, with multi-line and multi-file support.

**How to access**:

- Select code in your editor
- Press `Ctrl + I` (Windows/Linux) or `Cmd + I` (Mac)
- Or right-click → "Copilot" → "Start Inline Chat"

**Features**:

- Edit existing code with natural language instructions
- Preview changes before accepting
- Multi-line edits with context awareness
- Undo/redo support

**Best for**:

- Refactoring code
- Fixing bugs
- Updating multiple files
- Implementing feature requests

**Example**:

```typescript
// Select this code:
function getUserName(user) {
  return user.firstName + " " + user.lastName;
}

// Type in inline chat:
("Add null checking and return empty string if user is null");

// Copilot suggests:
function getUserName(user) {
  if (!user) return "";
  return user.firstName + " " + user.lastName;
}
```

---

### 4. **Copilot Edits** (Multi-file Editing)

**What it is**: Advanced editing mode that can modify multiple files across your workspace simultaneously.

**How to access**:

- Open Command Palette (`Ctrl+Shift+P`)
- Type "GitHub Copilot Edits: Open"
- Or click "Open Copilot Edits" in the Copilot Chat panel

**Features**:

- Edit multiple files at once
- Working set management (select which files to edit)
- Preview all changes before applying
- Supports large refactoring tasks

**Best for**:

- Refactoring across multiple files
- Implementing features that touch many files
- Renaming/moving functions across codebase
- Large-scale code updates

**Example**:

```
Instruction: "Rename FirebaseAnalyticsService to AnalyticsService across all files"

Copilot Edits will:
1. Find all references
2. Update imports
3. Update service names
4. Update test files
5. Show preview of all changes
```

**Note**: This is a newer feature and may require VS Code Insiders or latest stable version.

---

### 5. **Agent Mode** (Workspace Understanding)

**What it is**: AI agent that understands your entire codebase and can perform complex tasks.

**How to access**:

- In Copilot Chat, use `@workspace` participant
- Example: `@workspace where is the Firebase config defined?`

**Features**:

- Understands project structure
- Can search across all files
- Provides context-aware answers
- Suggests code changes based on existing patterns

**Best for**:

- Understanding large codebases
- Finding where functionality is implemented
- Getting architectural insights
- Code navigation and discovery

**Example Questions**:

```
"@workspace how is authentication implemented?"
"@workspace find all components that use Firebase Analytics"
"@workspace what design patterns are used in this project?"
"@workspace where should I add a new service?"
```

---

### 6. **Plan Mode** (Task Planning - Beta)

**What it is**: AI-powered task planning and step-by-step guidance for complex features.

**How to access**:

- Available in VS Code Insiders (experimental)
- Use in Copilot Chat with planning prompts

**Features**:

- Break down complex tasks into steps
- Generate implementation plan
- Guide through feature development
- Track progress

**Best for**:

- Planning large features
- Learning new technologies
- Structured development approach
- Complex refactoring projects

**Example**:

```
"Create a plan to add user authentication to this app"

Copilot suggests:
1. Install Firebase Auth package
2. Create AuthService
3. Add login component
4. Update routing with guards
5. Add user state management
6. Implement logout functionality
```

**Note**: This is an experimental feature and availability may vary.

---

## 🔧 Required VS Code Extensions

### Essential Extensions

#### 1. **GitHub Copilot** (Required)

```
Extension ID: GitHub.copilot
```

**Provides**:

- Inline code suggestions
- Code completion
- Core Copilot functionality

**Install**:

1. Open VS Code Extensions (`Ctrl+Shift+X`)
2. Search "GitHub Copilot"
3. Click Install
4. Sign in with your GitHub account

---

#### 2. **GitHub Copilot Chat** (Required for Chat features)

```
Extension ID: GitHub.copilot-chat
```

**Provides**:

- Chat interface
- Inline chat (`Ctrl+I`)
- `@workspace` agent
- Context variables

**Install**:

1. Open VS Code Extensions
2. Search "GitHub Copilot Chat"
3. Click Install

---

### Recommended Extensions (Enhance Copilot)

#### 3. **GitHub Copilot Labs** (Experimental Features)

```
Extension ID: GitHub.copilot-labs
```

**Provides**:

- Experimental Copilot features
- Early access to new capabilities
- Enhanced code brushes
- Custom commands

---

#### 4. **Angular Language Service** (For Angular projects)

```
Extension ID: Angular.ng-template
```

**Why**: Provides better context for Copilot in Angular templates

---

#### 5. **ESLint** + **Prettier**

```
Extension ID: dbaeumer.vscode-eslint
Extension ID: esbenp.prettier-vscode
```

**Why**: Copilot respects your code style when these are configured

---

### Verification

After installing, verify Copilot is active:

1. Open any code file
2. Start typing a function
3. You should see gray suggestion text
4. Check status bar (bottom right) for Copilot icon
5. Click Copilot icon to see status

**Troubleshooting**:

- If not working, click Copilot icon → "Check Copilot Status"
- Ensure you're signed in: Command Palette → "GitHub Copilot: Sign In"
- Restart VS Code if needed

---

## ☁️ Cloud vs Local Execution

Understanding where Copilot processing happens is important for privacy and performance:

### Cloud-Based (Requires Internet)

**All Copilot features run in the cloud**:

✅ **Inline Suggestions**

- Code sent to GitHub/OpenAI servers
- AI model processes in cloud
- Suggestions returned to VS Code

✅ **Chat Mode**

- Conversations sent to cloud
- Processed by GPT-4/Claude/other models
- Responses streamed back

✅ **Copilot Edits**

- Code context sent to cloud
- Multi-file changes computed remotely
- Results returned for preview

✅ **Agent Mode (@workspace)**

- Project structure indexed locally
- Queries sent to cloud with context
- Cloud AI provides answers

### Local Processing

❌ **No local AI processing**

- Copilot does NOT run AI models locally
- VS Code only handles UI and context gathering
- All AI inference happens on GitHub/OpenAI servers

### Privacy Implications

**What gets sent to cloud**:

- Code snippets (for suggestions)
- File context (for better suggestions)
- Chat messages
- Selected code (for edits)
- Project structure (for @workspace)

**What stays local**:

- Full file contents (only snippets sent)
- Git history
- Passwords/secrets in files (but still avoid committing!)

**Best practices**:

- Don't use Copilot with highly sensitive/proprietary code if concerned
- Review suggestions before accepting
- Use `.copilotignore` to exclude sensitive files
- Enterprise plan offers data residency options

### Offline Mode

**Copilot does NOT work offline**:

- Requires active internet connection
- No cached suggestions when offline
- Chat features unavailable without connection

---

## 🤖 Model Selection Guide

GitHub Copilot supports multiple AI models. Here's when to use each:

### Available Models

#### 1. **GPT-4** (Default - Recommended for most tasks)

```
Model: GPT-4 (via OpenAI)
```

**Strengths**:

- Most capable for complex reasoning
- Best for architectural questions
- Excellent at understanding context
- Superior code quality

**Best for**:

- Complex refactoring
- Debugging difficult issues
- Architectural decisions
- Learning new technologies

**Limitations**:

- Slower response time
- May hit rate limits on free tier

---

#### 2. **GPT-3.5-Turbo** (Faster, good for simple tasks)

```
Model: GPT-3.5-Turbo
```

**Strengths**:

- Very fast responses
- Good for simple queries
- Lower rate limits
- Cost-effective

**Best for**:

- Quick questions
- Simple code completion
- Formatting/style fixes
- Boilerplate generation

**Limitations**:

- Less context understanding
- May miss nuances
- Less accurate for complex logic

---

#### 3. **Claude 3.5 Sonnet** (Alternative to GPT-4)

```
Model: Claude 3.5 Sonnet (via Anthropic)
```

**Strengths**:

- Excellent at following instructions
- Very good at code generation
- Strong reasoning capabilities
- Different "perspective" than GPT

**Best for**:

- When GPT-4 gives unsatisfactory results
- Long-form code generation
- Detailed explanations
- Alternative viewpoint

**Limitations**:

- May have different availability
- Context window limits

---

#### 4. **o1-preview** and **o1-mini** (Advanced Reasoning - Beta)

```
Model: OpenAI o1-preview / o1-mini
```

**Strengths**:

- Advanced reasoning capabilities
- Better at complex problem solving
- Improved at mathematics/logic
- "Thinks" before responding

**Best for**:

- Complex algorithmic problems
- Mathematical computations
- Advanced debugging
- Multi-step reasoning tasks

**Limitations**:

- Beta/experimental
- May not be available on all plans
- Potentially slower

---

### How to Switch Models

**In Chat Interface**:

1. Click the model name at the top of chat panel
2. Select from dropdown:
   - GPT-4
   - GPT-3.5-Turbo
   - Claude 3.5 Sonnet
   - o1-preview/o1-mini (if available)

**Via Settings**:

1. Open Settings (`Ctrl+,`)
2. Search "copilot model"
3. Set `github.copilot.chat.model` preference

---

### Model Selection Strategy

**Use GPT-4 when**:

- Working on complex features
- Need deep codebase understanding
- Debugging difficult issues
- Learning new concepts

**Use GPT-3.5 when**:

- Need quick answers
- Simple formatting/style questions
- Generating boilerplate
- Rate limits hit on GPT-4

**Use Claude 3.5 when**:

- GPT-4 isn't giving good results
- Want a "second opinion"
- Prefer Claude's code style
- Need detailed step-by-step

**Use o1-preview when**:

- Complex algorithmic challenges
- Need advanced reasoning
- Mathematical problems
- Multi-step logic tasks

---

## ⚙️ Managing Models

### What "Manage Models" Means

The "Manage Models" option allows you to:

1. **View available models**: See which AI models you can access
2. **Set default model**: Choose preferred model for chat
3. **Switch models**: Change model mid-conversation
4. **Check availability**: See which models are active

### How to Access Model Management

**Method 1: Via Chat Panel**

1. Open Copilot Chat (`Ctrl+Alt+I`)
2. Click the model name at top of chat
3. See dropdown with available models
4. Click "Manage Models..." at bottom

**Method 2: Via Settings**

1. Open Settings (`Ctrl+,`)
2. Search "github.copilot"
3. Find "Chat: Model" setting
4. Select preferred default model

**Method 3: Via Command Palette**

1. Open Command Palette (`Ctrl+Shift+P`)
2. Type "GitHub Copilot: Select Model"
3. Choose from list

### Model Capabilities by Plan

| Model         | Individual ($100/yr) | Business   | Enterprise |
| ------------- | -------------------- | ---------- | ---------- |
| GPT-4         | ✅ Yes               | ✅ Yes     | ✅ Yes     |
| GPT-3.5-Turbo | ✅ Yes               | ✅ Yes     | ✅ Yes     |
| Claude 3.5    | ✅ Yes               | ✅ Yes     | ✅ Yes     |
| o1-preview    | ⚠️ Limited           | ✅ Yes     | ✅ Yes     |
| Custom models | ❌ No                | ⚠️ Limited | ✅ Yes     |

### Rate Limits

**Individual Plan**:

- GPT-4: ~50 requests/hour
- GPT-3.5: Higher limits
- Claude: Similar to GPT-4

**What happens when limit reached**:

- Copilot automatically switches to GPT-3.5
- Or shows "Rate limit exceeded" error
- Wait ~1 hour for reset

**Pro tip**: If hitting limits frequently, consider:

- Using GPT-3.5 for simple tasks
- Spreading out complex queries
- Upgrading to Business plan (higher limits)

---

## 🔗 Context Variables (# Commands)

Context variables (commands starting with `#`) provide specific context to Copilot Chat. They help Copilot understand exactly what you're asking about.

### Common Context Variables

#### 1. **#file** - Reference specific file

```
Syntax: #file:path/to/file.ts
Example: "Explain #file:src/app/services/firebase-analytics.service.ts"
```

**What it does**: Includes entire file content in the context  
**Use when**: Asking about specific file

---

#### 2. **#editor** - Currently active editor

```
Syntax: #editor
Example: "Add error handling to #editor"
```

**What it does**: References the file currently open in editor  
**Use when**: Working with current file

---

#### 3. **#selection** - Selected code

```
Syntax: #selection
Example: "Refactor #selection to use async/await"
```

**What it does**: Includes only selected text  
**Use when**: Asking about specific code block

---

#### 4. **#terminalLastCommand** - Last terminal command

```
Syntax: #terminalLastCommand
Example: "Why did #terminalLastCommand fail?"
```

**What it does**: Includes the last command run in integrated terminal  
**Use when**: Debugging terminal errors

---

#### 5. **#terminalSelection** - Selected terminal text

```
Syntax: #terminalSelection
Example: "What does #terminalSelection mean?"
```

**What it does**: Includes selected text from terminal  
**Use when**: Asking about terminal output/errors

---

### Workspace Participants

#### **@workspace** - Entire codebase context

```
Syntax: @workspace query
Example: "@workspace where is routing defined?"
```

**What it does**: Searches entire workspace for relevant context  
**Use when**:

- Finding where functionality is implemented
- Understanding project architecture
- Cross-file questions

---

#### **@vscode** - VS Code features

```
Syntax: @vscode query
Example: "@vscode how do I change theme?"
```

**What it does**: Answers questions about VS Code itself  
**Use when**: Learning VS Code features

---

#### **@terminal** - Terminal operations

```
Syntax: @terminal query
Example: "@terminal how do I run npm scripts?"
```

**What it does**: Help with terminal/command-line tasks  
**Use when**: Need terminal command help

---

### Slash Commands

Special commands for specific actions:

#### **/explain** - Explain code

```
Usage: /explain #selection
```

Provides detailed explanation of selected code

#### **/fix** - Fix problems

```
Usage: /fix #editor
```

Attempts to fix errors in current file

#### **/tests** - Generate tests

```
Usage: /tests for #file:src/services/analytics.service.ts
```

Generates unit tests for specified file

#### **/doc** - Add documentation

```
Usage: /doc #selection
```

Adds JSDoc/TSDoc comments to code

---

### Practical Examples

**Example 1: Debug terminal error**

```
Prompt: "Why did #terminalLastCommand fail?"

Copilot response:
"The command `npm run test:coverage` failed because...
1. Karma configuration issue
2. Missing dependency
Here's how to fix it..."
```

**Example 2: Find implementation**

```
Prompt: "@workspace where is Firebase initialized?"

Copilot response:
"Firebase is initialized in:
1. src/app/app.component.ts (line 45)
2. src/environments/environment.ts (config)
3. src/app/services/firebase-analytics.service.ts (usage)"
```

**Example 3: Fix current file**

```
Prompt: "/fix #editor"

Copilot response:
"I found 3 issues in this file:
1. Missing null check on line 23
2. Unused import on line 5
3. Type error on line 67
Here are the fixes..."
```

**Example 4: Refactor selection**

```
Select code block, then:
Prompt: "Refactor #selection to use RxJS operators"

Copilot provides refactored version using pipe(), map(), etc.
```

---

### Tips for Using Context Variables

✅ **Do**:

- Use `#file` when asking about specific files
- Use `@workspace` for project-wide questions
- Use `#terminalLastCommand` when debugging errors
- Use `#selection` to focus on specific code

❌ **Don't**:

- Over-specify context (Copilot is smart!)
- Use `#file` for huge files (may hit token limits)
- Forget you can combine variables: `"Compare #file:a.ts and #file:b.ts"`

---

## 📚 Recommended Tutorials

### 1. **Official GitHub Copilot Documentation**

**Link**: [https://docs.github.com/en/copilot](https://docs.github.com/en/copilot)

**Covers**:

- Complete feature overview
- Getting started guide
- All modes and capabilities
- Best practices
- Troubleshooting

**Why it's good**: Official, comprehensive, always up-to-date

**Best for**:

- Understanding all features
- Official feature documentation
- Latest capabilities

---

### 2. **VS Code Copilot Documentation**

**Link**: [https://code.visualstudio.com/docs/copilot/overview](https://code.visualstudio.com/docs/copilot/overview)

**Covers**:

- VS Code-specific integration
- Keyboard shortcuts
- Extension setup
- Chat features
- Context variables
- Inline chat usage

**Why it's good**: Focused on VS Code experience, practical examples

**Best for**:

- Learning VS Code shortcuts
- Understanding chat interface
- Practical workflow integration

---

### 3. **GitHub Copilot in VS Code - YouTube (Microsoft)**

**Link**: [https://www.youtube.com/watch?v=dhfTaSGYQ4o](https://www.youtube.com/watch?v=dhfTaSGYQ4o)

**Covers**:

- Live demonstrations
- Real-world use cases
- Tips and tricks
- Model selection
- Advanced features

**Why it's good**: Visual learning, real examples, Microsoft official

**Best for**:

- Visual learners
- Seeing features in action
- Learning workflows

---

### Additional Learning Resources

#### **GitHub Skills Course - Copilot**

**Link**: [https://skills.github.com/](https://skills.github.com/)

- Interactive hands-on learning
- Step-by-step exercises
- Practice with real code

#### **Copilot Blog (GitHub Blog)**

**Link**: [https://github.blog/tag/github-copilot/](https://github.blog/tag/github-copilot/)

- Latest features and updates
- Use case studies
- Best practices from GitHub team

#### **Stack Overflow - Copilot Tag**

**Link**: [https://stackoverflow.com/questions/tagged/github-copilot](https://stackoverflow.com/questions/tagged/github-copilot)

- Community Q&A
- Real-world problems and solutions
- Tips from other developers

---

## 🎯 Best Practices

### Maximizing Copilot Effectiveness

#### 1. **Provide Good Context**

✅ Write clear comments before code  
✅ Use descriptive variable/function names  
✅ Include type information (TypeScript)  
✅ Keep related code together

#### 2. **Use the Right Mode**

- **Inline suggestions**: Simple completions
- **Chat**: Questions and explanations
- **Inline chat**: Quick edits
- **Copilot Edits**: Multi-file changes
- **@workspace**: Codebase understanding

#### 3. **Iterate on Prompts**

- Start simple, add details if needed
- Use follow-up questions
- Reference previous suggestions
- Be specific about requirements

#### 4. **Verify Suggestions**

⚠️ **Always review code before accepting**  
⚠️ Test generated code  
⚠️ Check for security issues  
⚠️ Ensure code follows your standards

#### 5. **Leverage Context Variables**

```typescript
// Good: Specific context
"Refactor #selection to use async/await and add error handling";

// Better: Multiple contexts
"Update #file:service.ts and #file:service.spec.ts to use dependency injection";

// Best: Workspace awareness
"@workspace find all services and update them to use new logging pattern";
```

---

### Common Pitfalls to Avoid

❌ **Accepting everything blindly**

- Always review suggestions
- Test generated code
- Verify security/performance

❌ **Over-relying on Copilot**

- Understand the code you're writing
- Learn the concepts, don't just copy
- Use Copilot as a tool, not a replacement for learning

❌ **Ignoring your coding standards**

- Configure ESLint/Prettier
- Copilot will follow your style
- Review for consistency

❌ **Not using context effectively**

- Provide good comments
- Use type information
- Keep code organized

---

### Keyboard Shortcuts Cheat Sheet

| Action              | Windows/Linux    | Mac               |
| ------------------- | ---------------- | ----------------- |
| Accept suggestion   | `Tab`            | `Tab`             |
| Dismiss suggestion  | `Esc`            | `Esc`             |
| Next suggestion     | `Alt + ]`        | `Option + ]`      |
| Previous suggestion | `Alt + [`        | `Option + [`      |
| Open Chat           | `Ctrl + Alt + I` | `Cmd + Shift + I` |
| Inline Chat         | `Ctrl + I`       | `Cmd + I`         |
| Trigger suggestion  | `Alt + \`        | `Option + \`      |

---

## 🔒 Privacy and Security

### What to Be Aware Of

1. **Code Telemetry**: Copilot sends code snippets to cloud
2. **No Secrets**: Never rely on Copilot to keep secrets
3. **Review Suggestions**: AI can generate insecure code
4. **Public Code**: Copilot trained on public GitHub repos

### Best Practices for Security

✅ Use `.copilotignore` for sensitive files  
✅ Never put secrets in code (use environment variables)  
✅ Review all security-related code carefully  
✅ Use `.gitignore` for local secrets  
✅ Enable code scanning in GitHub

---

## 🚀 Next Steps

Now that you understand Copilot modes and features:

1. **Install Required Extensions**

   - GitHub Copilot
   - GitHub Copilot Chat

2. **Practice Each Mode**

   - Try inline suggestions
   - Ask questions in chat
   - Use inline chat for edits
   - Experiment with @workspace

3. **Learn Context Variables**

   - Use #file, #selection
   - Try @workspace queries
   - Practice with #terminalLastCommand

4. **Watch Tutorials**

   - Official VS Code docs
   - GitHub videos
   - Community resources

5. **Integrate into Workflow**
   - Use daily for coding
   - Ask questions as you learn
   - Refactor with Copilot Edits
   - Generate tests with /tests

---

## 📝 Summary

- **Copilot offers multiple modes**: Inline, Chat, Edit, Agent, Plan
- **Two required extensions**: GitHub Copilot + GitHub Copilot Chat
- **All processing is cloud-based**: Requires internet connection
- **Multiple models available**: GPT-4 (best), GPT-3.5 (fast), Claude (alternative)
- **Context variables enhance accuracy**: Use #file, #selection, @workspace, etc.
- **Always review suggestions**: AI is helpful but not perfect

Happy coding with GitHub Copilot! 🎉

---

**Document Version**: 1.0  
**Last Updated**: November 3, 2025  
**Author**: Hans Zöchbauer
