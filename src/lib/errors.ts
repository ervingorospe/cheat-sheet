export function getFriendlyErrorMessage(rawError: string | null): string {
  if (!rawError) {
    return "Something went wrong. Please try again.";
  }

  const message = rawError.toLowerCase();

  if (message.includes("worker_resource_limit") || message.includes("resource")) {
    return "That upload was too large to process. Try fewer photos, or smaller ones.";
  }

  if (message.includes("network") || message.includes("fetch")) {
    return "Couldn't connect. Check your internet connection and try again.";
  }

  if (message.includes("permission") || message.includes("not granted")) {
    return "Permission needed. Please allow access in your device settings.";
  }

  return "Something went wrong. Please try again.";
}