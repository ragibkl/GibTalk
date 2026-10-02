// Drives GibTalk through its main screens with Mobilewright and saves
// screenshots: on a real Android device locally, or an iOS simulator in CI.
// Elements are found by testID, which works the same on both platforms.
//
//   PLATFORM=android DEVICE=<adb serial> CLEAR=1 node e2e/screenshots.mjs
//   PLATFORM=ios DEVICE=<simulator udid> OUT=shots/iphone node e2e/screenshots.mjs
import { android, ios, expect } from "mobilewright";
import { execFileSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";

const platform = process.env.PLATFORM ?? "android";
const deviceId = process.env.DEVICE;
const out = process.env.OUT ?? "e2e-screenshots";
const appId = "com.ragibkl.GibTalk";
const LONG = { timeout: 30000 };

mkdirSync(out, { recursive: true });

// Start from an empty board (Android; an iOS simulator gets a fresh install).
if (platform === "android" && process.env.CLEAR) {
  execFileSync("adb", [...(deviceId ? ["-s", deviceId] : []), "shell", "pm", "clear", appId]);
}

const device = await (platform === "ios" ? ios : android).launch({ deviceId, bundleId: appId });
const { screen } = device;
const id = (testId) => screen.getByTestId(testId);

async function shot(name) {
  writeFileSync(`${out}/${name}.png`, await screen.screenshot());
  console.log("screenshot", name);
}

async function step(name, fn) {
  try {
    await fn();
    console.log("ok", name);
  } catch (error) {
    await shot(`failed-${name.replace(/\W+/g, "-")}`).catch(() => {});
    throw new Error(`step "${name}" failed: ${error.message}`);
  }
}

// Android: Back closes the on-screen keyboard (which can cover buttons).
// iOS: the dialogs move above the keyboard, so nothing to do.
async function hideKeyboard() {
  if (platform === "android") await screen.pressButton("BACK");
}

async function enterEditMode() {
  await id("button-Edit").tap();
  const prompt = await screen.getByText(/Please input \d{4} to continue/).getText();
  await id("passcode-input").fill(prompt.match(/\d{4}/)[0]);
  await hideKeyboard();
  await id("passcode-ok").tap();
  await expect(id("button-Done")).toBeVisible();
}

// Swipe until the element is on screen, then tap it. (scrollIntoViewIfNeeded
// in mobilewright 0.0.63 misjudged elements that were already on screen.)
async function scrollToAndTap(locator) {
  // Swipe in the lower part of the screen: in landscape the lists start
  // below the headings, so a swipe from the middle can miss them.
  const size = await (screen.screenSize ? screen.screenSize() : device.screenSize());
  for (let i = 0; i < 8 && !(await locator.isVisible({ timeout: 1000 })); i++) {
    await screen.swipe("up", {
      startX: size.width / 2,
      startY: size.height * 0.85,
      distance: size.height * 0.35,
    });
  }
  await locator.tap();
}

async function addTemplate(name) {
  await scrollToAndTap(id(`template-${name}`));
  await id("template-ok").tap();
  // Back on the board; the new folder is added at the end (maybe off screen).
  await expect(id("button-Templates")).toBeVisible(LONG);
}

async function openTemplates() {
  await id("button-Templates").tap();
  await expect(id("import-from-file")).toBeVisible(LONG);
}

try {
  await step("app opens", () => expect(id("button-Edit")).toBeVisible(LONG));
  await step("edit mode", enterEditMode);
  await step("templates screen", async () => {
    await openTemplates();
    await shot("04-templates");
  });
  await step("add templates", async () => {
    await addTemplate("Greetings");
    await openTemplates();
    await addTemplate("Mealtime");
    await openTemplates();
    await addTemplate("Outdoor Gym");
  });
  await step("board", async () => {
    await id("button-Done").tap();
    await expect(id("button-Edit")).toBeVisible();
    await shot("01-board");
  });
  await step("folder and sentence", async () => {
    await scrollToAndTap(id("word-Greetings"));
    await scrollToAndTap(id("word-Hi"));
    await scrollToAndTap(id("word-Good Morning"));
    await shot("02-folder");
    await id("button-Home").tap();
  });
  await step("keyboard", async () => {
    await id("tab-Keyboard").tap();
    await id("keyboard-input").fill("I want to play outside");
    await hideKeyboard();
    await shot("03-keyboard");
    await id("tab-Home").tap();
  });
  await step("language list", async () => {
    await enterEditMode();
    await id("button-Add").tap();
    await id("language-picker").tap();
    await expect(id("language-add")).toBeVisible();
    await shot("05-language-list");
  });
} finally {
  await device.close();
}
