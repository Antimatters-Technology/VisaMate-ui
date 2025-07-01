# VisaMate Chrome Extension

A Chrome extension that automatically fills visa application forms using questionnaire answers stored in DynamoDB.

## Features

- **Auto-fill forms**: Automatically populates visa portal forms with your questionnaire answers
- **Smart field mapping**: Intelligently maps questionnaire answers to form fields
- **Auto-progression**: Automatically clicks "Next" buttons when forms are completed
- **Real-time progress**: Shows filling progress and status
- **Multi-portal support**: Works with multiple visa portals (Canada, Australia, UK)
- **DynamoDB integration**: Fetches answers from your VisaMate wizard session

## Setup

### 1. Install Dependencies

```bash
cd VisaMate-ui/chrome-extension
npm install
```

### 2. Build the Extension

```bash
npm run build
```

This creates a `dist/` folder with the compiled extension.

### 3. Load in Chrome

1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode" (toggle in top right)
3. Click "Load unpacked" button
4. Select the `dist/` folder

## Configuration

1. Click the VisaMate extension icon in Chrome toolbar
2. Click "Show Configuration"
3. Set your API settings:
   - **API Base URL**: `http://localhost:8000/api/v1` (for local development)
   - **Session ID**: Your wizard session ID (or click "New" to create one)
   - **API Key**: Optional authentication key

## Usage

### Automatic Mode

1. Navigate to a supported visa portal website
2. The extension will automatically detect forms and show a helper panel
3. Enable "Auto-fill" in the helper panel
4. Click "Fill Current Form" or it will auto-fill when forms load
5. The extension will automatically click "Next" when forms are completed

### Manual Mode

1. Use the popup interface to manually trigger form filling
2. Monitor progress and status in the helper panel
3. Manually click next buttons when needed

## Supported Portals

- **Immigration Canada** (cic.gc.ca)
- **Australian Immigration** (homeaffairs.gov.au)
- **UK Visas** (gov.uk)

## Field Mapping

The extension uses intelligent field mapping to match questionnaire answers to form fields:

- **Name matching**: Matches field names, IDs, and labels
- **Semantic mapping**: Uses predefined mappings for common fields
- **Context analysis**: Analyzes nearby text and form structure

### Common Field Mappings

| Questionnaire Question | Form Fields |
|----------------------|-------------|
| "What would you like to do in Canada?" | `purpose`, `visit_purpose`, `intention` |
| "What country issued your passport?" | `passport_country`, `citizenship`, `nationality` |
| "What is your date of birth?" | `birth_date`, `dob`, `date_of_birth` |
| "What is the name of your institution?" | `institution_name`, `school_name`, `university` |

## Development

### File Structure

```
chrome-extension/
├── manifest.json          # Extension manifest
├── background.js          # Background service worker
├── content.ts            # Content script (main autofill logic)
├── popup.tsx             # Popup interface
├── popup.html            # Popup HTML
├── content.css           # Content script styles
├── types.d.ts            # TypeScript declarations
├── webpack.config.js     # Build configuration
├── tsconfig.json         # TypeScript configuration
└── package.json          # Dependencies and scripts
```

### Build Commands

```bash
# Development build with watch
npm run dev

# Production build
npm run build

# Type checking
npm run type-check

# Clean build directory
npm run clean
```

### Adding New Portals

To add support for a new visa portal:

1. Add portal configuration to `PORTAL_CONFIGS` in `content.ts`
2. Define field selectors for the portal
3. Add field mappings for questionnaire questions
4. Update manifest.json with new host permissions

Example:

```typescript
'newportal.gov': {
  name: 'New Portal',
  selectors: {
    forms: ['form.application'],
    inputs: ['input', 'select', 'textarea'],
    nextButton: ['.next-btn'],
    errorMessages: ['.error'],
    submitButton: ['.submit-btn']
  },
  fieldMappings: {
    'What country issued your passport?': ['passport_country'],
    // ... more mappings
  },
  autoFillEnabled: true
}
```

## API Integration

The extension communicates with the VisaMate API to:

- Fetch questionnaire answers from DynamoDB
- Create new wizard sessions
- Sync data automatically

### API Endpoints Used

- `GET /wizard/questionnaire/{sessionId}/answers` - Fetch answers
- `POST /wizard/create-session` - Create new session

## Troubleshooting

### Common Issues

1. **Forms not filling**: Check if portal is supported and session ID is configured
2. **Field mapping issues**: Review field mappings in console logs
3. **API connection errors**: Verify API URL and network connectivity
4. **Permission errors**: Ensure extension has necessary permissions

### Debug Mode

1. Open Chrome DevTools (F12)
2. Check Console tab for extension logs
3. Look for "VisaMate:" prefixed messages
4. Monitor network requests to API

### Reset Extension

1. Go to `chrome://extensions/`
2. Find VisaMate Assistant
3. Click "Remove" and reload the unpacked extension

## Security

- Extension only runs on whitelisted visa portal domains
- API communication uses HTTPS in production
- No sensitive data stored locally beyond session cache
- User controls when autofill is enabled

## Contributing

1. Make changes to source files
2. Test with `npm run dev`
3. Build with `npm run build`
4. Test in Chrome with built extension

## Support

For issues or questions:
1. Check browser console for error messages
2. Verify API connectivity
3. Ensure portal website is supported
4. Contact VisaMate support team 