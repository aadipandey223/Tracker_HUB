---
description: How to deploy the Tracker Hub application to Vercel
---

# Deploying to Vercel

This guide explains how to deploy your React application to Vercel.

## Prerequisites

1.  A [Vercel account](https://vercel.com/signup).
2.  Your project pushed to a GitHub repository.

## Steps

1.  **Login to Vercel** and go to your **Dashboard**.
2.  Click **"Add New..."** -> **"Project"**.
3.  **Import Git Repository**: Select your `Tracker_HUB` repository.
4.  **Configure Project**:
    - **Framework Preset**: Vercel should auto-detect "Vite". If not, select it.
    - **Root Directory**: `./` (default).
    - **Build Command**: `npm run build` (default).
    - **Output Directory**: `dist` (default).
5.  **Environment Variables**:
    - Expand the "Environment Variables" section.
    - Add the variables from your `.env` file:
        - `VITE_SUPABASE_URL`: (Your Supabase URL)
        - `VITE_SUPABASE_KEY`: (Your Supabase Anon Key)
6.  Click **"Deploy"**.

## Post-Deployment

- Vercel will build your project.
- Once done, you'll get a production URL (e.g., `tracker-hub.vercel.app`).
- **Important**: Go to your **Supabase Dashboard** -> **Authentication** -> **URL Configuration**.
    - Add your new Vercel URL to the **Site URL** or **Redirect URLs** to ensure login redirects work correctly.
