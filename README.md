# User App for Drone Delivery System

This is the user application for the drone delivery system. It allows users to place orders and track their status.

## Features

- Order placement with item details and location input.
- Real-time order status tracking.
- OTP generation and verification for delivery confirmation.
- Mobile-friendly design.
- Dummy map for order tracking.

## Tech Stack

- React
- React Router DOM
- Supabase

## Setup

1. Make sure you have Node.js and npm installed.
2. Navigate to the `user-app` directory.
3. Run `npm install` to install dependencies.
4. Create a `.env` file in the `user-app` directory and add your Supabase URL and Anon Key:

   ```
   REACT_APP_SUPABASE_URL=your_supabase_url
   REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

5. Run `npm start` to start the development server.
6. Open your browser and go to http://localhost:3000.