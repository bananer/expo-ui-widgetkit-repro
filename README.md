# @expo/ui links WidgetKit into apps without widgets

Minimal reproduction for: `@expo/ui` unconditionally imports and links `WidgetKit` on iOS,
so apps that use it for ordinary UI get flagged by App Store review for "widget extension functionality".

Created with `npx create-expo-app@latest --template blank`, plus:

- `@expo/ui` (installed with `npx expo install @expo/ui`)
- `App.js` renders a single `DatePicker`
- `ios.bundleIdentifier` in `app.json`

No `expo-widgets`, no Live Activities, no config plugin, no extension target.

## Steps

1. `npm install`
2. Build an iOS release binary, for example `eas build --platform ios --profile production`
   (or `npx expo run:ios --configuration Release` on macOS). Unzip the resulting `.ipa`.
3. Check that the app has no extension:

   ```
   ls Payload/*.app/PlugIns
   # ls: No such file or directory
   ```

4. Check that WidgetKit is linked into the app binary anyway:

   ```
   otool -L Payload/*.app/<AppBinary> | grep -i widgetkit
   # /System/Library/Frameworks/WidgetKit.framework/WidgetKit
   ```

5. Submitting such a build has been rejected by App Review with:
   "Your app seems to include widget extension functionality, but we were unable to find a widget option for your app."

## Cause

Three Swift files in `node_modules/@expo/ui/ios` contain `import WidgetKit`, guarded only by `#if !os(tvOS)`:

```
grep -rn 'import WidgetKit' node_modules/@expo/ui/ios
```

They are compiled by `ExpoUI.podspec` (`**/*.swift`), and `ExpoUIModule.swift` /
`ViewModifierRegistry.swift` register `AccessoryWidgetBackgroundView`, `widgetURL` and
`containerBackground` unconditionally.

## Versions

- expo ~57.0.26
- @expo/ui ~57.0.21
- react-native 0.86.3
