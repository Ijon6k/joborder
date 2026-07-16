# Job Order Monorepo

Welcome to the Job Order project. This repository is structured as a monorepo containing:
* **`frontend/`**: The Next.js application using Bun, React, TypeScript, Tailwind CSS, Zod, React Hook Form, TanStack Query, and Axios.
* **`backend/`**: Python-based backend application (to be configured).

## Getting Started

### Prerequisites

You need [Bun](https://bun.sh) installed globally to run the frontend app.

### Running the Frontend

To start the Next.js development server:

```bash
cd frontend
bun install
bun run dev
```

The app will be available at [http://localhost:3000](http://localhost:3000).

### Docker Setup

A root-level `docker-compose.yml` is provided to run the services in containers. Run:

```bash
docker-compose up --build
```
