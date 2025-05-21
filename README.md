# SportsDeck - Real-Time Sports Scores in VS Code



## Overview

**SportsDeck** is a Visual Studio Code extension that delivers real-time sports scores, fixtures, and statistics directly to your coding environment. Stay updated on your favorite games without leaving your workflow.

---

## Features

- **🌐 Live Match Updates**
    - Real-time scores from major sports leagues
    - Live event notifications (goals, wickets, points, etc.)
    - Status bar and side panel viewing options

- **📅 Comprehensive Coverage**
    - Football (Premier League, La Liga, UEFA, FIFA, etc.)
    - Cricket (IPL, World Cup, Ashes, etc.)
    - Basketball (NBA, EuroLeague)
    - Tennis (ATP, WTA, Grand Slams)
    - And more...

- **⚙️ Customizable Experience**
    - Follow your favorite teams and leagues
    - Adjustable update frequency
    - Multiple display modes (status bar, panel, or both)
    - Configurable notifications

- **🚀 Developer-Friendly**
    - Lightweight and performant
    - Dark mode support
    - Non-intrusive updates
    - One-click pause for focused coding sessions

---

## Installation

1. Open VS Code.
2. Go to the Extensions view (`Ctrl+Shift+X` or `Cmd+Shift+X`).
3. Search for **SportsDeck**.
4. Click **Install**.
5. Reload VS Code when prompted.

**Alternatively, install via CLI:**

```bash
code --install-extension publisher.sportsdeck
```

---

## Configuration

Configure SportsDeck through VS Code settings (`Ctrl+,` or `Cmd+,`):

```json
"sportsdeck": {
    "favoriteSports": ["football", "cricket"],
    "favoriteLeagues": ["premier-league", "ipl"],
    "favoriteTeams": ["arsenal", "mumbai-indians"],
    "updateInterval": 60,
    "displayMode": "both",
    "notifications": true,
    "apiKey": "your-api-key-here"
}
```

---

## Usage

### Basic Commands

- **Show SportsDeck Panel:** `Ctrl+Shift+P` → "SportsDeck: Show Panel"
- **Refresh Data:** `Ctrl+Shift+P` → "SportsDeck: Refresh"
- **Toggle Live Updates:** `Ctrl+Shift+P` → "SportsDeck: Toggle Live Updates"

### Status Bar

- Click the status bar item to open the panel.
- Hover to see current match details.

### Panel Features

- View live and upcoming matches.
- See detailed match statistics.
- Filter by sport or league.

---

## Screenshots

- **Live Matches View:** Live matches displayed in the side panel.
- **Status Bar Notification:** Current match score in status bar.

---

## Contributing

We welcome contributions! To get started:

1. Fork the repository.
2. Create a feature branch:  
     `git checkout -b feature/your-feature`
3. Commit your changes:  
     `git commit -m 'Add some feature'`
4. Push to the branch:  
     `git push origin feature/your-feature`
5. Open a Pull Request.

Please read our [Contribution Guidelines](CONTRIBUTING.md) for more details.

---

## License

This project is licensed under the [MIT License](LICENSE).

---

## Contact

Have questions or suggestions? We'd love to hear from you!

- **Email:** [santujana1827@gmail.com](mailto:santujana1827@gmail.com.dev)
- **GitHub Issues:** [Report an issue](https://github.com/akku27-cse/sportsdeck/issues)

---

Happy Coding and Game Watching! 🎮👨‍💻