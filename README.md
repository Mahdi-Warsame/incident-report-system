# NHS Incident Report System Prototype

A full-stack web application for reporting and tracking healthcare incidents, built with Node.js and React.

## Features

- **User Authentication**: NHS Login integration with email-based authentication
- **Incident Reporting Form**: Capture incident details including type, severity, and location
- **BI Dashboard**: Analytics and visualization of incident data
- **Real-time Analytics**: Track incident patterns and trends
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

### Backend
- Node.js with Express
- MongoDB for data storage
- JWT for authentication
- RESTful API

### Frontend
- React 18
- TypeScript Support
- Tailwind CSS for styling
- Recharts for data visualization

## Project Structure

```
.
├── server/          # Node.js backend
├── client/          # React frontend
├── package.json     # Root package configuration
└── README.md        # This file
```

## Getting Started

### Prerequisites
- Node.js >= 16.0.0
- npm or yarn
- MongoDB (local or Atlas)

### Installation

```bash
# Install root dependencies
npm install

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install

# Return to root
cd ..
```

### Environment Variables

Create `.env` file in the `server` directory:

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/incident-report
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development
```

### Running the Application

```bash
# Run both server and client
npm start
```

The application will be available at `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user

### Incidents
- `GET /api/incidents` - Fetch all incidents
- `GET /api/incidents/:id` - Fetch incident by ID
- `POST /api/incidents` - Create new incident
- `PUT /api/incidents/:id` - Update incident
- `DELETE /api/incidents/:id` - Delete incident

### Analytics
- `GET /api/analytics/dashboard` - Get dashboard statistics
- `GET /api/analytics/incidents-by-type` - Get incident type distribution
- `GET /api/analytics/severity-trends` - Get severity trends over time

## License

MIT