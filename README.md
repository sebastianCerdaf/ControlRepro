# ControlRepro

## Requirements

- [Node.js](https://nodejs.org/) (v18 or newer recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- [Git](https://git-scm.com/) (for cloning, optional)

## Project Structure

The main Electron + Vue project is inside the `Proyecto` folder:

```
ControlRepro/
├── Proyecto/
│   ├── package.json
│   ├── main.js
│   ├── ...
```

## Setup & Run (Development)

1. Open a terminal and navigate to the `Proyecto` folder:

   ```sh
   cd Proyecto
   ```

2. Install dependencies:

   ```sh
   npm install
   ```

3. Start the Electron app:

   ```sh
   npm start
   ```

## Build (Windows Installer)

To create a distributable Windows installer:

1. In the `Proyecto` folder, run:

   ```sh
   npm run dist
   ```

The installer will be created in the `dist/` folder.

## Notes

- The app uses Electron, Vue 3 (via CDN), and xlsx for Excel export.
- Main app code is organized by clean architecture inside `Proyecto/`.
- For development, edit files inside `Proyecto/presentation/views/` and `Proyecto/presentation/scripts/`.