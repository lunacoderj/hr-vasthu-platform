/**
 * Image Engine & Prompt Hashing
 */

import crypto from 'crypto';

export class ImageEngine {
  private generatedPromptHashes: Set<string> = new Set();

  /**
   * Hashes a prompt string with SHA-256
   */
  public hashPrompt(prompt: string): string {
    return crypto.createHash('sha256').update(prompt.trim().toLowerCase()).digest('hex');
  }

  /**
   * Validates if a prompt is unique in this batch run
   */
  public isPromptUnique(prompt: string): boolean {
    const hash = this.hashPrompt(prompt);
    if (this.generatedPromptHashes.has(hash)) {
      return false;
    }
    this.generatedPromptHashes.add(hash);
    return true;
  }

  /**
   * Builds a photorealistic, watermark-free image URL
   */
  public getImageUrl(prompt: string, width = 1200, height = 700): string {
    const sanitized = encodeURIComponent(prompt.trim().slice(0, 120));
    return `https://image.pollinations.ai/prompt/${sanitized}?width=${width}&height=${height}&nologo=true`;
  }
}
