# telegram-reaction-engine
🚀 Professional Telegram Reaction Engine with 500+ emojis, multi‑bot support, smart de‑duplication, and Vercel serverless deployment. Built by Cyb3rKaran.
# Telegram Reaction Engine Professional

**Version 5.0.0** · Developed by **Cyb3rKaran**

A high‑performance, production‑ready API to automatically apply random reactions to Telegram messages using multiple bot tokens. Designed for Vercel serverless environments.

---

## Features

- **Massive Emoji Library** – 500+ Telegram‑supported emojis organised into:
  - Positive, Negative, Funny, Love, Premium, Mixed, Random
- **Smart De‑duplication** – avoids applying the same emoji twice to the same message (when using `mode=unique`).
- **Multiple Tokens & Chats** – handle many bots and chats in a single request.
- **Auto‑Discovery** – automatically fetch the latest message ID if not provided.
- **Retry & Timeout** – automatic retries (2 attempts) and 10s timeouts.
- **New Endpoints**:
  - `/` – API information
  - `/health` – server health (memory, uptime, Node version)
  - `/stats` – execution statistics
- **Professional JSON Responses** – consistent format with `success`, `developer`, `execution_time`, etc.
- **Zero External Dependencies** – pure Node.js.

---

## Quick Deploy on Vercel

1. **Fork/Clone** this repository.
2. **Deploy to Vercel**:
   ```bash
   npm install -g vercel
   vercel
