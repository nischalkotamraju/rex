<table border="0" cellspacing="0" cellpadding="0">
<tr>
<td><img src="extension/public/icons/icon128.png" width="120" alt="Rex" /></td>
<td>&nbsp;&nbsp;&nbsp;&nbsp;</td>
<td><h1>Rex</h1><p>AI commitment tracker that lives inside Gmail.</p></td>
</tr>
</table>

Rex is a Chrome extension that automatically detects commitments, deadlines, and promises buried in your email threads and makes sure nothing falls through the cracks.

![Chrome](https://img.shields.io/badge/Chrome-Extension-4285F4?style=flat&logo=googlechrome&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=black)
![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat&logo=nextdotjs&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=flat&logo=supabase&logoColor=white)
![Claude](https://img.shields.io/badge/Claude_AI-D97706?style=flat&logo=anthropic&logoColor=white)

<br>

## What it does

- **Commitment detection** reads your threads and surfaces anything with a real expectation attached: deadlines, promises, follow-ups
- **Inbox overview** sits at the top of Gmail showing everything outstanding across all your threads at once
- **AI draft replies** writes a response for you when a commitment is detected, pre-filled in Gmail's compose window
- **Persistent tracking** syncs everything to Supabase so your commitments survive refreshes and restarts

<br>

## Stack

| | |
|---|---|
| Extension | React + TypeScript + Vite, Shadow DOM, Manifest V3 |
| Website | Next.js 15, Tailwind CSS, Framer Motion |
| Server | Express, Claude API (Anthropic) |
| Auth & DB | Supabase |

<br>

## Getting started

### 1. Server

```bash
cd server
npm install
cp .env.example .env
npm run dev
```

### 2. Extension

```bash
cd extension
npm install
npm run build
```

Load `extension/dist/` as an unpacked extension in `chrome://extensions`.

### 3. Website

```bash
cd website
npm install
cp .env.local.example .env.local
npm run dev
```
