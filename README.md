<h1 align="center">Gymetry</h1>

<!-- <img src="https://res.cloudinary.com/di0av3xly/image/upload/v1740043755/Gymetry/dashboard_dark.png" alt="Gymetry Dashboard" width="1200" height="675" /> -->

<p align="center">
  <img src="./public/img/preview.png" alt="Gymetry Logo" />
</p>

<p align="center">
  <a href="https://gymetry.vercel.app">
    <img src="https://img.shields.io/badge/website-blue?style=for-the-badge&logo=vercel&logoColor=white" alt="Website">
  </a>
  <a href="https://github.com/pantharhsit007/gymetry/issues">
    <img src="https://img.shields.io/github/issues/pantharhsit007/gymetry?style=for-the-badge" alt="Issues">
  </a>
  <a href="https://github.com/pantharhsit007/gymetry/stargazers">
    <img src="https://img.shields.io/github/stars/pantharhsit007/gymetry?style=for-the-badge" alt="Stars">
  </a>
  <a href="https://github.com/pantharhsit007/gymetry/blob/main/LICENSE">
    <img src="https://img.shields.io/github/license/pantharhsit007/gymetry?style=for-the-badge" alt="License">
  </a>
</p>

[![Landing page](./public/img/banner.png)](https://www.tella.tv/video/randoms-video-1vbv)

## About

Gymetry makes it easy to log your daily workouts and visualize your fitness journey with powerful data insights. Whether you're tracking weights, reps, or even your walking activity, Gymetry offers an intuitive dashboard to monitor progress over time.

## Installation

### Clone the Repository

```bash
git clone https://github.com/pantharhsit007/gymetry.git
cd gymetry
```

### Install Dependencies

```bash
pnpm install
```

### Start the Development Server

```bash
pnpm dev
```

## Environment Variables

Create a `.env` file in the root directory and add the following:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
AUTH_SECRET=""
AUTH_GOOGLE_ID=""
AUTH_GOOGLE_SECRET=""
DATABASE_URL="postgresql://postgres:mysecretpassword@localhost:5432/gymetry"
REDIS_URL="redis://localhost:6379"
UPSTASH_REDIS_REST_URL=""
UPSTASH_REDIS_REST_TOKEN=""
CACHE_TTL="86400" # 24 hours
NEXT_PUBLIC_POSTHOG_KEY=""
NEXT_PUBLIC_POSTHOG_HOST="https://us.i.posthog.com"
```

Make sure to update the values as necessary for your setup.

## Setting Up Database & Redis

Gymetry uses PostgreSQL as its database and Redis for caching. You have a couple of options:

### Option 1: Using Docker (Recommended)

If you have Docker installed, you can spin up both PostgreSQL and Redis with one command:

```bash
pnpm db:docker
```

_(This command should be set up in your package.json scripts to run a Docker Compose file that starts both services.)_

Alternatively, if you prefer to run the services manually, use the commands below:

#### Start PostgreSQL

```bash
docker run --name gymetry-db \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=mysecretpassword \
  -e POSTGRES_DB=gymetry \
  -p 5432:5432 \
  -d postgres
```

#### Start Redis

```bash
docker run --name gymetry-redis \
  -p 6379:6379 \
  -d redis
```

Ensure that your `.env` file’s `DATABASE_URL` and `REDIS_URL` match the settings above.

## Tech Stack

- **Frontend:** Next.js, Tailwind CSS, TypeScript
- **Backend:** Next.js API Routes, NextAuth.js for authentication
- **Database:** PostgreSQL
- **Caching:** Redis

## Contributing

Contributions are welcome! To contribute:

1. Fork the repository.
2. Create a new branch for your feature (`git checkout -b feature-name`).
3. Commit your changes (`git commit -m 'Add some feature'`).
4. Push to the branch (`git push origin feature-name`).
5. Open a Pull Request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
