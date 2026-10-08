# SmartWaste IoT Management System

A production-ready React + Vite frontend dashboard for smart city waste intelligence, real-time ESP32 sensor telemetry, driver route dispatch, technician maintenance diagnostics, and supervisor oversight.

## 🚀 Key Features

- **Role-Based Access Control (RBAC)**:
  - 🛠️ **ADMIN**: Fleet overview, smart bin fleet telemetry, driver management, collection dispatch, system alert thresholds.
  - 🚛 **DRIVER**: Cockpit mobile view, collection queue, route navigation, real-time pickup status confirmation.
  - ⚡ **IOT TECHNICIAN**: ESP32 hardware telemetry (HC-SR04 ultrasonic, DHT22 temp/humidity, MPU6050 tilt), battery voltages, sensor fault alerts, maintenance log.
  - 📊 **SUPERVISOR**: Zone coverage heatmaps, collection schedules, driver GPS tracking, sustainability ESG metrics.
- **Role Isolation**: Strict route guards block unauthorized access between roles.
- **Interactive Map Engine**: Visual GIS city map with pulsating smart bin statuses, fill percentages, and depot dispatch pins.
- **Modern Glassmorphic UI**: High-tech responsive dashboard design inspired by Google Stitch UI.
- **Mock State Service**: LocalStorage backed reactive state simulating live IoT telemetry, collection updates, and alert triggers.

## 📦 Getting Started

### 1. Install dependencies
```bash
npm install
```

### 2. Run local development server
```bash
npm run dev
```

### 3. Demo Credentials
You can log in with one-click demo role buttons on the Login page, or enter:
- **Admin**: `admin@smartwaste.io` / `admin123`
- **Driver**: `driver@smartwaste.io` / `driver123`
- **IoT Technician**: `tech@smartwaste.io` / `tech123`
- **Supervisor**: `supervisor@smartwaste.io` / `supervisor123`
