# Universal Agent Builder (UAB)

A web-based application for creating AI agents from prompts using A2A (Agent-to-Agent Protocol), ADK (Agent Development Kit), and MCP (Model Context Protocol) frameworks.

![Universal Agent Builder](https://img.shields.io/badge/status-active-brightgreen) ![License](https://img.shields.io/badge/license-MIT-blue) ![JavaScript](https://img.shields.io/badge/JavaScript-vanilla-yellow)

## 🚀 Features

- **Interactive Agent Creation**: Build AI agents through a guided step-by-step interface
- **Multiple Framework Support**: Choose from A2A, ADK, and MCP frameworks
- **Pre-built Templates**: Quick-start templates for common agent types
- **Auto-Framework Selection**: Intelligent framework suggestions based on prompts
- **Real-time Configuration**: Dynamic configuration forms based on selected frameworks
- **Agent Testing Interface**: Built-in mock testing environment
- **State Persistence**: Automatic saving of work with localStorage
- **Export Functionality**: Download agent configurations as JSON
- **Deployment Configuration**: Multiple deployment options (Local, Cloud, Container, Edge)

## 🏗️ Architecture

### Framework Integration
- **A2A (Agent-to-Agent Protocol)**: Enables communication between AI agents
- **ADK (Agent Development Kit)**: Provides workflow orchestration and deployment tools
- **MCP (Model Context Protocol)**: Connects LLMs to external tools and data sources

### Templates
- **Customer Service Agent**: Handles inquiries with A2A + MCP
- **Data Analysis Agent**: Processes data with ADK + MCP
- **Content Creation Agent**: Generates content with A2A + ADK  
- **Multi-Agent Coordinator**: Orchestrates multiple agents with all frameworks

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Quick Start
```bash
# Clone the repository
git clone https://github.com/yourusername/universal-agent-builder.git
cd universal-agent-builder

# Install dependencies
npm install

# Start development server
npm start

# Open browser to http://localhost:3000
```

### Available Commands
```bash
npm start              # Start development server (port 3000)
npm run build          # Build minified production assets
npm run serve          # Serve production build (port 8080)
npm run lint           # Lint JavaScript code
npm run format         # Format code with Prettier
npm test               # Run test interface (port 3001)
npm run test:manual    # Manual testing with console runner
```

## 📖 Usage Guide

### 1. Create Agent Prompt
Enter a detailed description of what you want your agent to do.

### 2. Select AI Frameworks
Choose from A2A, ADK, and MCP frameworks based on your needs:
- **A2A**: For agent collaboration and communication
- **ADK**: For complex workflows and production deployment
- **MCP**: For external tool integration and data access

### 3. Configure Framework Settings
Fill in framework-specific configuration options like ports, security settings, and resource limits.

### 4. Preview & Test
- **Configuration Tab**: View generated JSON configuration
- **Test Agent Tab**: Interact with simulated agent responses

### 5. Deploy
Configure deployment options for your target environment.

## 🧪 Testing

The project includes comprehensive testing capabilities:

### Automated Testing
```bash
# Run visual test interface
npm test

# Manual testing with browser console
npm run test:manual
# Then run: new UABTestRunner().runTests()
```

### Manual Testing
See [TEST_CASES.md](TEST_CASES.md) for detailed manual testing scenarios covering:
- Framework selection and configuration
- Template functionality
- Error handling and edge cases
- State persistence
- Complete user workflows

### Test Coverage
- ✅ Framework selection logic
- ✅ Template system functionality
- ✅ Configuration generation
- ✅ State management and persistence
- ✅ Error handling and validation
- ✅ User interface interactions

## 📁 Project Structure

```
universal-agent-builder/
├── assets/
│   ├── css/
│   │   └── style.css          # Design system and styling
│   └── js/
│       └── app.js             # Main application logic
├── dist/                      # Minified production assets
├── index.html                 # Main application page
├── test.html                  # Visual testing interface
├── test-runner.js             # Browser-based test runner
├── package.json               # Dependencies and scripts
├── CLAUDE.md                  # AI assistant guidance
├── TEST_CASES.md              # Comprehensive test documentation
└── README.md                  # This file
```

## 🎯 Key Components

### State Management
- Centralized `appState` object with localStorage persistence
- Automatic state synchronization between UI and data
- Support for complex data types (Set objects, nested configurations)

### Framework Configuration
Each framework generates specific configuration sections:
- **A2A**: Discovery protocols, communication ports, security modes
- **ADK**: Workflow types, execution environments, retry policies  
- **MCP**: Server implementations, tool categories, context windows

### Template System
Pre-configured agent templates with:
- Domain-specific prompts
- Recommended framework combinations
- Default tool configurations
- Context-aware testing responses

## 🚀 Deployment

### Local Development
```bash
npm start              # Development with live reload
```

### Production Build
```bash
npm run build          # Creates minified assets in dist/
npm run serve          # Serves production build
```

### Framework-Specific Deployment
The application generates deployment configurations for:
- **Local**: Python virtual environments
- **Cloud**: AWS, GCP, Azure platforms
- **Container**: Docker with various base images
- **Edge**: ARM/x64 edge devices and infrastructure

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Add tests for new functionality
5. Run the test suite (`npm test`)
6. Commit your changes (`git commit -m 'Add amazing feature'`)
7. Push to the branch (`git push origin feature/amazing-feature`)
8. Open a Pull Request

### Development Guidelines
- Follow existing code style (run `npm run format`)
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting PR

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with vanilla JavaScript for maximum compatibility
- Uses modern CSS custom properties for theming
- Inspired by modern agent orchestration frameworks
- Test suite designed for comprehensive quality assurance

## 📊 Project Status

- ✅ Core functionality complete
- ✅ Framework integration working
- ✅ Test suite comprehensive
- ✅ Documentation complete
- 🔄 Deployment automation (planned)
- 🔄 Real agent integration (planned)
- 🔄 Advanced template system (planned)

---

**Built with ❤️ for the AI agent development community**