# The Garden - Interactive Insect Web App

An interactive web application designed for a building projection art installation. It allows users to control animated insect sprites using their mobile devices, which appear in real-time on a projected admin screen.

## 🌐 Live URLs

- Customer View: [thenaturetakeover.org.uk/customer](https://thenaturetakeover.org.uk/customer)
- Admin View: [thenaturetakeover.org.uk/admin](https://thenaturetakeover.org.uk/admin)
- Project Overview: [antdickinson.co.uk/projects/the-garden](https://antdickinson.co.uk/projects/the-garden)

## 🧩 Tech Stack

- **Frontend**: P5.js, HTML, CSS, JavaScript
- **Backend**: Node.js, Express, Socket.io
- **Templating**: Pug
- **File Transfer**: FileZilla (SFTP)
- **Server Access**: SSH

## 📁 Structure

- `public/` – Public assets including images and splash screen content
- `views/` – `.pug` files for admin and customer screens
- `scripts/` – Frontend interaction scripts
- `server/` – WebSocket and Express server logic
- `image-directory/` – Subdirectories for animated frames per insect type

## 🐞 Core Features

- Real-time multi-user insect control using websockets
- Mobile-friendly customer screen responsive to touch
- Admin screen with fixed resolution overlay for projection
- Random insect assignment with hue customization
- Customizable splash screen and idle detection
- Insect animation using multiple PNG frame sequences
- Organic and behavior-specific movement types: butterflies, bees, walking insects

## 🔧 Developer Instructions

### 1. Setup

```bash
npm install
