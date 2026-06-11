// Minimal Chrome extension API types for use in the website's extension-callback page.
// The full types are only available in the extension build environment.
declare const chrome: {
  runtime: {
    sendMessage: (extensionId: string, message: unknown, callback?: () => void) => void
  }
} | undefined
