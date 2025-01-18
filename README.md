
---

# **GeoFence App**

An intuitive React Native application for creating, viewing, editing, and managing geo-fences using Google Maps. The app supports functionality such as adding points, resetting, undoing changes, centering geo-fences, and viewing saved geo-fences, all integrated with Redux for state management.

---

## **Features**

- **Create GeoFences**:
  - Add points dynamically to draw geo-fences on the map.
  - Save geo-fences to Redux for persistent state management.

- **Edit GeoFences**:
  - Modify existing geo-fences by adding/removing points.
  - Center the geo-fence dynamically to keep it in focus.

- **View GeoFences**:
  - Display saved geo-fences with accurate center alignment.

- **Interactive Map Controls**:
  - Toggle between map views (Standard/Satellite).
  - Reset geo-fences or undo the last action.
  - Automatically center the geo-fence on the map.

---

## **Tech Stack**

- **Frontend**:
  - [React Native](https://reactnative.dev)
  - [react-native-maps](https://github.com/react-native-maps/react-native-maps)

- **State Management**:
  - [Redux](https://redux.js.org)
  - [Redux Toolkit](https://redux-toolkit.js.org)

- **Location Services**:
  - [Expo Location](https://docs.expo.dev/versions/latest/sdk/location/)

---

## **Setup and Installation**

### Prerequisites

- Node.js (v20+ required)
- Expo CLI
- Android/iOS emulator or physical device
- Git

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/almustarik/geofencing-app.git
   cd geofencing-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Install Expo CLI (if not already installed):
   ```bash
   npm install -g expo-cli
   ```

4. Start the Expo development server:
   ```bash
   npm start
   ```

---

## **Run the App**

1. **Start the Expo Development Server**:
   ```bash
   npm start
   ```

2. **Run on Your Device (Using Expo Go)**:
   - Install the **Expo Go** app from the [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent) or [Apple App Store](https://apps.apple.com/us/app/expo-go/id982107779).
   - Open the Expo Go app on your device.
   - Scan the QR code displayed in your terminal or browser after running `npm start`.
   - The app will load and run on your device.

3. **Run on an Emulator/Simulator** (Optional):
   - **Android Emulator**:
     - Ensure Android Studio is installed and an emulator is running.
     - Run the app using:
       ```bash
       npm run android
       ```
   - **iOS Simulator**:
     - Ensure Xcode is installed and a simulator is running.
     - Run the app using:
       ```bash
       npm run ios
       ```

4. **Hot Reloading**:
   - Any changes made in the code will automatically reflect in the app (with hot reloading).

---

## **Usage**

### Add a New GeoFence
1. Tap the **"Add New Map"** button on the home screen.
2. Click on the map to add points for your geo-fence.
3. Use the controls to:
   - Save the geo-fence.
   - Reset the geo-fence.
   - Undo the last action.
   - Center your location.

### View a Saved GeoFence
1. Navigate to the home screen.
2. Select a geo-fence from the list and tap **"View"**.
3. The geo-fence will be displayed on the map.

### Edit a GeoFence
1. From the home screen, tap **"Edit"** for a saved geo-fence.
2. Modify the geo-fence as needed and save the changes.

---

## **Screenshots**

| Feature        | Screenshot(s)                                                                 |
|----------------|-------------------------------------------------------------------------------|
| **Splash Screen**       | ![SplashScreen](/src/assets/splash-screen.jpg)                                       |
| **Home**       | ![Home](/src/assets/list-geofence.jpg)                                       |
| **Add GeoFence** | ![Add 1](/src/assets/add-geofence.jpg) ![Add 2](/src/assets/add-geofence-v2.jpg) ![Add 3](/src/assets/centered-location.jpg) |
| **View GeoFence** | ![View 1](/src/assets/view-geofence.jpg) ![View 2](/src/assets/view-geofence-v2.jpg) |
| **Edit GeoFence** | ![Edit](/src/assets/edit-geofence.jpg)                                     |
| **Delete GeoFence** | ![Delete](/src/assets/delete-geofence.jpg)                               |


## **License**

This project is licensed under the [MIT License](LICENSE).

---

## **Acknowledgements**

- [React Native Maps](https://github.com/react-native-maps/react-native-maps)
- [Expo](https://expo.dev/)
- [Redux Toolkit](https://redux-toolkit.js.org)

---