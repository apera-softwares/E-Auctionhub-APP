Deployment Proccess with expo cli:

increase version from app.json

_first install expo CLI_
-npm install -g eas-cli

_Log in to your Expo account_
-eas login

_Configure the project_
-eas build:configure

_Run a build_
for android
-eas build --platform android

for ios
-eas build --platform ios

for both
-eas build --platform all

_Submit to Store_
-eas submit android
-eas submit ios
-eas submit --platform all

