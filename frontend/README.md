# AI Email Assistant - Frontend

Beautiful and responsive React frontend for the AI Email Assistant application.

## Features

- 📧 **Email Processing Form**: Submit emails for AI analysis
- 📊 **Results Display**: View comprehensive AI analysis including:
  - Email categorization (7 categories)
  - Importance scoring (0-100)
  - Smart summarization
  - Tone analysis
  - Key points extraction
  - Action items identification
  - Suggested reply generation (3 versions)
- 📋 **Email List**: Browse and filter processed emails
- 📈 **Statistics Dashboard**: View email analytics
- 🎨 **Modern UI**: Clean, professional design with Lucide icons
- 📱 **Responsive**: Works on desktop, tablet, and mobile

## Tech Stack

- **React 18.2.0**: Frontend framework
- **Axios 1.6.0**: HTTP client for API communication
- **Lucide React 0.263.1**: Beautiful icon library
- **CSS3**: Custom styling with gradients and animations

## Quick Start

### Prerequisites

- Node.js 14+ and npm
- Backend server running on `http://localhost:5000`

### Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Configure environment**:
   
   Create `.env` file in the frontend directory:
   ```
   REACT_APP_API_URL=http://localhost:5000/api/v1
   ```

3. **Start development server**:
   ```bash
   npm start
   ```

   The app will open at `http://localhost:3000`

## Project Structure

```
frontend/
├── public/
│   └── index.html          # HTML template
├── src/
│   ├── components/
│   │   ├── EmailForm.js    # Email input form
│   │   ├── EmailResult.js  # AI analysis results display
│   │   ├── EmailList.js    # List of processed emails
│   │   └── Statistics.js   # Analytics dashboard
│   ├── services/
│   │   └── api.js          # API client with axios
│   ├── styles/
│   │   ├── App.css         # Main app styles
│   │   ├── EmailForm.css   # Form component styles
│   │   ├── EmailResult.css # Result display styles
│   │   ├── EmailList.css   # List view styles
│   │   └── Statistics.css  # Stats dashboard styles
│   ├── App.js              # Main application component
│   └── index.js            # React entry point
├── .env                    # Environment variables
├── .gitignore              # Git ignore rules
├── package.json            # Dependencies
└── README.md               # This file
```

## Available Scripts

- `npm start` - Start development server (port 3000)
- `npm run build` - Build for production
- `npm test` - Run tests
- `npm run eject` - Eject from Create React App (irreversible)

## Components Overview

### EmailForm
- Input fields for sender, subject, and email body
- Sample email buttons (urgent, personal, newsletter)
- Form validation
- Loading states during processing

### EmailResult
- Category badges with color coding
- Importance meter with visual progress bar
- Summary text with tone indicators
- Key points as bullet list
- Action items as checkboxes
- Suggested actions as tags
- Reply versions (brief, standard, detailed) with copy buttons

### EmailList
- Search functionality
- Category filtering (Work, Personal, Spam, etc.)
- Importance filtering
- Expandable email cards
- Delete functionality

### Statistics
- Total emails counter
- Important emails counter
- Importance ratio percentage
- Category breakdown with bar charts

## API Integration

The frontend communicates with the backend through the `api.js` service:

```javascript
// Process a single email
const response = await emailApi.processEmail({
  user_id: "user_123",
  sender: "john@example.com",
  subject: "Project Update",
  body: "Email content..."
});

// Get all emails for a user
const emails = await emailApi.getEmails("user_123");

// Get statistics
const stats = await emailApi.getStats("user_123");
```

## User ID Management

- User ID is automatically generated on first visit
- Stored in browser's localStorage
- Can be reset using the "Reset" button in header
- Used to track emails per user across sessions

## Styling

The application uses a modern, gradient-based design:

- **Primary Color**: Blue (#3B82F6)
- **Background**: Purple gradient (#667eea → #764ba2)
- **Category Colors**:
  - Work: Blue
  - Personal: Green
  - Spam: Red
  - Newsletter: Purple
  - Announcement: Amber
  - Support: Cyan
  - Financial: Orange

## Sample Emails

The form includes 3 pre-loaded sample emails for testing:

1. **Urgent Work Email**: High importance, professional tone
2. **Personal Message**: Medium importance, casual tone
3. **Newsletter**: Low importance, promotional tone

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Development Tips

1. **Enable Hot Reload**: Changes auto-refresh in development
2. **Check Console**: API errors and logs appear in browser console
3. **Network Tab**: Inspect API requests/responses
4. **Component State**: Use React DevTools for debugging

## Production Build

Build optimized production bundle:

```bash
npm run build
```

Output in `build/` directory. Deploy to:
- Vercel
- Netlify
- GitHub Pages
- AWS S3 + CloudFront
- Any static hosting service

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `REACT_APP_API_URL` | Backend API base URL | `http://localhost:5000/api/v1` |

## Troubleshooting

### API Connection Issues
```
Error: Network Error
```
**Solution**: Ensure backend is running on port 5000

### CORS Errors
```
Access-Control-Allow-Origin error
```
**Solution**: Backend must have CORS enabled (already configured)

### Blank Screen
**Solution**: Check browser console for errors, ensure all dependencies installed

### Styles Not Loading
**Solution**: Verify CSS imports in App.js, clear browser cache

## Contributing

1. Follow React best practices
2. Use functional components with hooks
3. Keep components under 300 lines
4. Add PropTypes for type checking
5. Write descriptive commit messages

## License

MIT

## Support

For issues or questions, check:
- Backend README: `../backend/README.md`
- Architecture docs: `../backend/ARCHITECTURE.md`
- API documentation in backend README

---

**Developed with ❤️ using React and OpenAI**
