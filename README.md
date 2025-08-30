# 🎲 Choose Random - Random Item Selector

A standalone web application for creating and managing random selection scenarios. Perfect for making decisions when you can't choose between multiple options!

## Features

- **Create Custom Scenarios**: Add your own scenarios with custom titles and multiple choices
- **Random Selection**: Click a button to randomly select from your choices with a fun animation
- **Local Storage**: All your scenarios are saved locally in your browser - no server required
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **Modern UI**: Beautiful, intuitive interface with smooth animations

## How to Use

### Getting Started

1. Open `index.html` in any modern web browser
2. The application will load with an empty state (or sample data if enabled)

### Creating a New Scenario

1. In the "Create New Scenario" section, enter a title for your scenario
2. Add your choices in the text area, with one choice per line
3. Click "Create Scenario" to save it

**Example:**
```
Title: What to eat for dinner
Choices:
Pizza
Burger
Salad
Sushi
Pasta
```

### Using Random Selection

1. Click on any scenario card from your list
2. A modal will open showing your scenario title
3. Click the "🎲 Choose Random!" button to make a selection
4. Watch the animation as it cycles through choices
5. The final selection will be highlighted in green

### Managing Scenarios

- **Delete**: Click the "Delete Scenario" button in the selection modal
- **View**: All scenarios are automatically saved and will persist between browser sessions
- **Sort**: Scenarios are sorted by creation date (newest first)

## Technical Details

- **No Dependencies**: Pure HTML, CSS, and JavaScript
- **Local Storage**: Uses browser's localStorage API for data persistence
- **Responsive**: CSS Grid and Flexbox for responsive layout
- **Accessibility**: Keyboard navigation support (Escape to close modals)
- **Cross-browser**: Works in all modern browsers

## File Structure

```
choose_random/
├── index.html      # Main HTML file
├── styles.css      # CSS styles and responsive design
├── script.js       # JavaScript functionality
└── README.md       # This file
```

## Browser Compatibility

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Local Development

To run the application locally:

1. Clone or download the files
2. Open `index.html` in your web browser
3. No build process or server required!

## Customization

### Adding Sample Data

To add sample scenarios for demonstration, uncomment the last line in `script.js`:

```javascript
addSampleData();
```

### Styling

The application uses CSS custom properties and can be easily customized by modifying `styles.css`. The color scheme and layout can be adjusted to match your preferences.

## Privacy

- All data is stored locally in your browser
- No data is sent to any external servers
- Your scenarios remain private and on your device

## License

This project is open source and available under the MIT License.

---

**Enjoy making random decisions! 🎲**
