/**
 * Transcript QA & Cleaner
 */

export interface TranscriptQAResult {
  valid: boolean;
  cleaned_text: string;
  word_count: number;
  error?: string;
}

export function validateAndCleanTranscript(
  rawTranscript: string,
  title: string,
  description?: string
): TranscriptQAResult {
  if (!rawTranscript && !description) {
    return {
      valid: false,
      cleaned_text: '',
      word_count: 0,
      error: 'Empty transcript and description'
    };
  }

  // 1. Remove music/audio artifacts
  let text = (rawTranscript || description || '')
    .replace(/\[Music\]/gi, '')
    .replace(/\[Applause\]/gi, '')
    .replace(/\[Laughter\]/gi, '')
    .replace(/\[Foreign\]/gi, '')
    .replace(/https?:\/\/\S+/g, '')
    .replace(/#[\w\u0C00-\u0C7F]+/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  // 2. Check for garbled auto-detected non-Telugu/Turkish phonetics
  const isGarbled =
    text.startsWith('bu fatura') ||
    text.includes('kullandım') ||
    text.includes('Bilmiyorum');

  if (isGarbled) {
    // Replace with clean architectural context from title + description
    text = `${title}. ${description || ''}`
      .replace(/https?:\/\/\S+/g, '')
      .replace(/#[\w\u0C00-\u0C7F]+/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  const words = text.split(/\s+/).filter(Boolean);

  if (words.length < 5) {
    return {
      valid: false,
      cleaned_text: text,
      word_count: words.length,
      error: `Transcript too short (${words.length} words)`
    };
  }

  return {
    valid: true,
    cleaned_text: text,
    word_count: words.length
  };
}
