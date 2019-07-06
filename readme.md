# Node Google Auth with Passport

Minimum frame work to get Node up and running using the Express framework and Google Authentication using Passport.js

## Instructions

1. Follow the instructions in this doc: [Add Google OAuth 2.0
   Authentication to your App](https://docs.google.com/document/d/1DkJOQuLMotBMFUGABxQIOk9Pb5Mrp--lX6t-CzcYkDc/edit?usp=sharing) to create a Google Project, enable it to authenticate users and obtain the project credentials for use in the app
1. Clone down the repository
1. Rename `.env.example` to `.env`
1. Add the Google authentication details, along with a random phrase for the SESSION SECRET to this `.env` file

   ```
   SESSION_SECRET="my phrase"
   GOOGLE_CLIENT_ID="client_id"
   GOOGLE_CLIENT_SECRET="client_secret"
   GOOGLE_CALLBACK_URL="/auth/google/callback"
   ```

1. `cd` to your project folder and run `npm install` to install the packages
1. Run `npm run start` to start the server
