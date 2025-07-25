# IRCC Autofill Helper Chrome Extension

Automatically fill the IRCC e-application eligibility questionnaire with pre-configured answers. This extension helps streamline the Canadian immigration application process by filling all 32 questions in the eligibility questionnaire.

## 🚀 Features

- **Automatic Form Filling**: Fills all 32 questions in the IRCC eligibility questionnaire
- **Pre-configured Answers**: Comes with a complete set of answers for study permit applications
- **Smart Matching**: Uses intelligent text matching to find form fields
- **Customizable**: Edit and save your own answers through the popup interface
- **No Backend Required**: Everything runs locally in your browser
- **Visual Feedback**: Shows progress and completion status
- **Persistent Storage**: Your answers are saved and synced across Chrome instances

## 📋 Pre-configured Answers

The extension comes with answers configured for:
- **Purpose**: Study in Canada
- **Duration**: Temporarily – more than 6 months
- **Country**: India (IND passport)
- **Study**: Post-secondary designated learning institution
- **Financial**: Provincial attestation letter, GIC, tuition paid
- **Language**: IELTS with 6.0+ scores
- **Medical**: Completed medical exam
- **And 20+ more questions**

## 🛠 Installation

### Method 1: Load Unpacked Extension (Developer Mode)

1. **Enable Developer Mode**:
   - Open Chrome and go to `chrome://extensions/`
   - Toggle "Developer mode" ON (top right corner)

2. **Load the Extension**:
   - Click "Load unpacked"
   - Navigate to and select the `chrome-extension` folder
   - The extension should appear in your extensions list

3. **Pin the Extension**:
   - Click the puzzle piece icon in Chrome toolbar
   - Find "IRCC Autofill Helper" and click the pin icon

### Method 2: Package and Install

1. **Package the Extension**:
   - Go to `chrome://extensions/`
   - Click "Pack extension"
   - Select the `chrome-extension` folder
   - This creates a `.crx` file

2. **Install the Package**:
   - Drag the `.crx` file to the extensions page
   - Click "Add extension" when prompted

## 📖 How to Use

1. **Navigate to IRCC Site**:
   ```
   https://onlineservices-servicesenligne.cic.gc.ca/eapp/eapp
   ```

2. **Start the Questionnaire**:
   - Click "Find out if you're eligible to apply"
   - Begin answering the eligibility questions

3. **Run the Autofill**:
   - Click the extension icon in Chrome toolbar
   - Click "🚀 Start Autofill" button
   - Watch as all 32 questions get filled automatically

4. **Review and Continue**:
   - Verify the filled answers
   - Make any necessary adjustments
   - Continue with your application

## ⚙️ Customization

### Editing Answers

1. Click the extension icon
2. Click "⚙️ Settings"
3. Edit the JSON in the textarea
4. Click "💾 Save" to store your changes

### JSON Format

```json
{
  "What would you like to do in Canada?": "Study",
  "How long are you planning to stay in Canada?": "Temporarily – more than 6 months",
  "Select the code that matches the one on your passport.": "IND (India)",
  ...
}
```

**Important**: 
- Question keys must match exactly with the form text
- Answer values must match the dropdown options exactly
- Use proper JSON syntax (quotes around strings, commas between items)

### Resetting to Defaults

1. Open the extension popup
2. Click "⚙️ Settings"
3. Click "🔄 Reset"
4. Confirm to restore original answers

## 🔧 Technical Details

### File Structure
```
chrome-extension/
├── manifest.json          # Extension configuration
├── background.js          # Service worker
├── content.js            # Form filling logic
├── popup.html            # User interface
├── popup.js              # UI interactions
├── answers.json          # Default answers
└── icons/                # Extension icons
```

### How It Works

1. **Content Script**: Runs on IRCC pages, watches for form elements
2. **Background Worker**: Manages extension lifecycle and storage
3. **Smart Matching**: Finds form fields by matching question text
4. **Event Simulation**: Triggers proper form events for compatibility
5. **Storage Sync**: Saves answers to Chrome sync storage

### Permissions Used

- `storage`: Save and sync your answers
- `scripting`: Inject autofill script into pages
- `activeTab`: Access current tab information
- `host_permissions`: Access IRCC website

## 🐛 Troubleshooting

### Extension Not Working?

1. **Check the Site**: Make sure you're on the correct IRCC URL
2. **Reload Extension**: Go to `chrome://extensions/` and click reload
3. **Check Console**: Open DevTools and look for error messages
4. **Verify Answers**: Ensure your JSON is valid in settings

### Fields Not Filling?

1. **Question Text Changed**: IRCC may have updated question wording
2. **Form Structure Changed**: Page layout may have been modified
3. **Timing Issues**: Try clicking autofill again after page loads
4. **Manual Override**: Fill remaining fields manually

### Common Issues

- **"Please navigate to IRCC site first"**: You're not on the correct page
- **"No fields were filled"**: Questions may not match stored answers
- **JSON Parse Error**: Check your JSON syntax in settings

## 🔒 Privacy & Security

- **No Data Collection**: Extension doesn't send data anywhere
- **Local Storage Only**: All data stays on your device
- **No Network Requests**: Except to the IRCC site you're already using
- **Chrome Sync**: Uses Chrome's built-in sync (optional)

## 📝 Supported Questions

The extension handles these question types:
- Dropdown selections (select elements)
- Text inputs (name, dates)
- Radio buttons (Yes/No questions)
- Checkboxes (multiple choice)

## 🆔 Version History

- **v1.0.0**: Initial release with 32 pre-configured questions
- Support for study permit applications
- Smart field matching and form filling
- User-friendly popup interface

## 📞 Support

If you encounter issues:
1. Check this README for troubleshooting steps
2. Verify you're using the latest version
3. Test with default settings (reset button)
4. Check browser console for error messages

## ⚖️ Legal Notice

This extension is designed to help fill forms more efficiently. Users are responsible for:
- Verifying all filled information is accurate
- Ensuring compliance with IRCC requirements
- Reviewing answers before submission
- Following all applicable immigration laws

**Disclaimer**: This is an unofficial tool not affiliated with IRCC or the Government of Canada. 