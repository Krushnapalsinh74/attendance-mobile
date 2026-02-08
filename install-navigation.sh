#!/bin/bash
# Navigation Setup Installation Script
# Run this to install all required navigation dependencies

echo "🚀 Installing React Navigation packages..."

# Core navigation
npm install @react-navigation/native@^6.1.9

# Navigators
npm install @react-navigation/stack@^6.3.20
npm install @react-navigation/bottom-tabs@^6.5.11
npm install @react-navigation/drawer@^6.6.6

# Required dependencies
npx expo install react-native-screens react-native-safe-area-context
npx expo install react-native-gesture-handler react-native-reanimated

# AsyncStorage for auth
npx expo install @react-native-async-storage/async-storage

echo ""
echo "✅ All navigation packages installed!"
echo ""
echo "⚠️  IMPORTANT: Add to babel.config.js:"
echo ""
echo "module.exports = function(api) {"
echo "  api.cache(true);"
echo "  return {"
echo "    presets: ['babel-preset-expo'],"
echo "    plugins: ['react-native-reanimated/plugin'],"
echo "  };"
echo "};"
echo ""
echo "🎉 After updating babel.config.js, restart your dev server with:"
echo "   npx expo start -c"
echo ""
