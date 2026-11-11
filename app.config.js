// Test builds (eas build --profile preview) install beside the store app,
// so testing never replaces the real GibTalk or its words.
module.exports = ({ config }) =>
  process.env.APP_VARIANT === "preview"
    ? {
        ...config,
        name: "GibTalk Test",
        android: { ...config.android, package: "com.ragibkl.GibTalk.test" },
      }
    : config;
