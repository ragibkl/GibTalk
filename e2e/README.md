# UI testing (work in progress, not merged)

Two attempts at automated UI tests and store screenshots for GibTalk, kept
on this branch while they don't work end to end yet.

## Mobilewright: `e2e/screenshots.mjs`

Drives GibTalk by testID (added to the app in #48) on a real Android device
or an iOS simulator, and saves screenshots.

```sh
cd e2e && npm install          # Node 22.12+
PLATFORM=android DEVICE=<adb serial> OUT=shots node screenshots.mjs
PLATFORM=ios DEVICE=<simulator udid> OUT=shots node screenshots.mjs
```

Status (2 Oct 2026, realme C75, Android 16): passes "app opens", "edit
mode" and "templates screen"; fails scrolling the template list to the
second template. Notes:

- mobilewright 0.0.63's `scrollIntoViewIfNeeded` misjudged an element that
  was already on screen; the script swipes itself, but `screen.swipe` from
  the lower part of the screen still didn't reach "Mealtime". Next: check
  the swipe in a screenshot, or give the template list a testID and use
  `locator.swipe`.
- `pressButton` is on `screen`, not `device`. On Android, press BACK to
  hide the floating keyboard before tapping a dialog's Ok button.
- `pm clear` is blocked on realme phones, so `CLEAR=1` can't reset the app
  there.

## Maestro on the iOS simulator: `.maestro/` and `.github/workflows/ios-simulator.yml`

Builds for the simulator on GitHub's macOS runner and runs the Maestro flow
on an iPhone 16 Pro Max and an iPad Pro 13" (manual `workflow_dispatch`).
Never passed in 6 runs. What each run found:

- On iOS a tappable element is named after all of its text (", Edit",
  "Greetings, Basic Greetings in English, - GK -"): match with patterns, or
  better, testIDs.
- Maestro re-taps when it sees no change, and the second tap closed the
  passcode dialog (`retryTapIfNoChange: false`).
- ModalOpacity merged whole dialogs into one accessibility element (fixed
  in the app, #44).
- On iPad GibTalk runs in portrait (iPadOS ignores the landscape lock);
  only iPhone screenshots need rotating.
- "iOS driver not ready in time" on shared runners
  (`MAESTRO_DRIVER_STARTUP_TIMEOUT`).
- Newer Maestro rejects `takeScreenshot` paths outside its own output
  folder: use relative names and copy them from `~/.maestro/tests`.
- The flow still matches by text; switching it to the #48 testIDs is the
  obvious next step.
