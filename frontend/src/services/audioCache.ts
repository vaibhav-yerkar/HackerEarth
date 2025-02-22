export class AudioCache {
  private static cache = new Map<string, string>();

  static async getAudioUrl(cacheKey: string): Promise<string | null> {
    return this.cache.get(cacheKey) || null;
  }

  static setAudioCache(cacheKey: string, audioBlob: Blob): string {
    // Revoke existing URL if it exists
    const existingUrl = this.cache.get(cacheKey);
    if (existingUrl) {
      URL.revokeObjectURL(existingUrl);
    }

    // Create new URL
    const url = URL.createObjectURL(
      new Blob([audioBlob], { type: "audio/mpeg" })
    );
    this.cache.set(cacheKey, url);
    return url;
  }

  static clearCache() {
    this.cache.forEach((url) => URL.revokeObjectURL(url));
    this.cache.clear();
  }
}
