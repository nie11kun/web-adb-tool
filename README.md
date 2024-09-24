# Web ADB Tool

Web ADB Tool is a web-based application that allows you to manage Android devices remotely using ADB (Android Debug Bridge) commands. This tool provides a user-friendly interface for common ADB operations such as connecting to devices, installing APKs, listing installed apps, and uninstalling apps.

## Features

- Connect to Android devices over network
- Scan for available devices
- Install APK files remotely
- List installed third-party applications
- View app version information
- Uninstall applications with confirmation

## Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js (v12 or later)
- npm (usually comes with Node.js)
- ADB (Android Debug Bridge) installed and added to your system PATH

## Installation

To install Web ADB Tool, follow these steps:

1. Clone the repository:
   ```
   git clone https://github.com/nie11kun/web-adb-tool.git
   cd web-adb-tool
   ```

2. Install the dependencies for both server and client:
   ```
   npm install
   cd server
   npm install
   ```

## Usage

To use Web ADB Tool, follow these steps:

1. Start the backend server:
   ```
   cd server
   node server.js
   ```
   The server will start on `http://localhost:5000` by default.

2. In a new terminal, start the frontend development server:
   ```
   cd ..  # If you're still in the server directory
   npm start
   ```
   The React development server will start, usually on `http://localhost:3000`.

3. Open your web browser and navigate to `http://localhost:3000`.

4. Use the interface to connect to devices, install APKs, list apps, and perform other operations.

## Main Components

- **Server**: Express.js server (server.js) that interfaces with ADB and executes commands.
- **Frontend**: React application providing the user interface.
  - `App.js`: Main component containing the overall layout and state management.
  - `DeviceScanner.js`: Component for scanning and listing available devices.
  - `DeviceSelector.js`: Component for selecting a device to operate on.
  - `FileUploader.js`: Component for selecting APK files to install.
  - `InstallButton.js`: Component for initiating the APK installation process.
  - `ListAppsButton.js`: Component for listing installed apps and providing uninstall functionality.

## Contributing

Contributions to Mobile ADB Tool are welcome. Please follow these steps:

1. Fork the repository.
2. Create a new branch: `git checkout -b <branch_name>`.
3. Make your changes and commit them: `git commit -m '<commit_message>'`
4. Push to the original branch: `git push origin <project_name>/<location>`
5. Create the pull request.

Alternatively, see the GitHub documentation on [creating a pull request](https://help.github.com/articles/creating-a-pull-request/).

## License

This project uses the following license: [MIT License](LICENSE).

## Contact

If you want to contact the maintainer, you can reach out at [me@niekun.net](mailto:me@niekun.net).