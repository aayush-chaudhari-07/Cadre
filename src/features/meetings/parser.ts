/**
 * Subtitle and transcript parsing utilities for Cadre Meeting Intelligence.
 * Strips timestamps, cue metadata, and styling from WebVTT (.vtt) and SubRip (.srt) files.
 */

const TIMESTAMP_LINE_REGEX =
  /^\s*(?:\d{1,2}:)?\d{2}:\d{2}[.,]\d{3}\s*-->\s*(?:\d{1,2}:)?\d{2}:\d{2}[.,]\d{3}.*$/;

const SHORT_TIMESTAMP_LINE_REGEX =
  /^\s*\d{2}:\d{2}[.,]\d{3}\s*-->\s*\d{2}:\d{2}[.,]\d{3}.*$/;

const INLINE_TAG_REGEX = /<(?:\/?[a-zA-Z][^>]*|\d{2}:\d{2}(?::\d{2})?[.,]\d{3})>/g;

const VOICE_TAG_REGEX = /<v(?:\.[^>]+)?\s+([^>]+)>/gi;

/**
 * Strips subtitle timestamps, cue numbering, and metadata from WebVTT or SRT text.
 * Leaves clean, readable conversational transcript text.
 */
export function stripSubtitleTimestamps(rawText: string): string {
  if (!rawText || typeof rawText !== 'string') {
    return '';
  }

  // Normalize line endings
  const lines = rawText.replace(/\r\n/g, '\n').replace(/\r/g, '\n').split('\n');
  const cleanLines: string[] = [];

  let inNoteBlock = false;
  let inStyleBlock = false;

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    if (rawLine === undefined) continue;
    const line = rawLine.trim();

    // Check for empty line
    if (!line) {
      inNoteBlock = false;
      inStyleBlock = false;
      continue;
    }

    // WebVTT header or metadata
    if (line.startsWith('WEBVTT') || line.startsWith('Kind:') || line.startsWith('Language:')) {
      continue;
    }

    // NOTE blocks in VTT
    if (line.startsWith('NOTE')) {
      inNoteBlock = true;
      continue;
    }
    if (inNoteBlock) {
      continue;
    }

    // STYLE blocks in VTT
    if (line.startsWith('STYLE')) {
      inStyleBlock = true;
      continue;
    }
    if (inStyleBlock) {
      continue;
    }

    // Skip cue identifier numbers (e.g. "1", "24") if the next non-empty line is a timestamp
    if (/^\d+$/.test(line)) {
      let isCueNumber = false;
      for (let j = i + 1; j < Math.min(i + 4, lines.length); j++) {
        const nextRaw = lines[j];
        if (nextRaw === undefined) continue;
        const next = nextRaw.trim();
        if (!next) continue;
        if (TIMESTAMP_LINE_REGEX.test(next) || SHORT_TIMESTAMP_LINE_REGEX.test(next)) {
          isCueNumber = true;
        }
        break;
      }
      if (isCueNumber) {
        continue;
      }
    }

    // Skip timestamp lines
    if (TIMESTAMP_LINE_REGEX.test(line) || SHORT_TIMESTAMP_LINE_REGEX.test(line)) {
      continue;
    }

    // Clean inline formatting tags
    // 1. Transform `<v Speaker Name>Text` to `Speaker Name: Text`
    let processed = line.replace(VOICE_TAG_REGEX, '$1: ');

    // 2. Remove other HTML/VTT tags like <b>, <i>, <c.color>, </v>, <00:01.000>
    processed = processed.replace(INLINE_TAG_REGEX, '').trim();

    if (!processed) {
      continue;
    }

    // Deduplicate consecutive identical lines (common in live streaming captions)
    if (cleanLines.length > 0 && cleanLines[cleanLines.length - 1] === processed) {
      continue;
    }

    cleanLines.push(processed);
  }

  // Join lines with natural spacing
  return cleanLines.join('\n');
}

/**
 * Formats transcript character count with a safety cap (e.g., 60,000 max).
 */
export const MAX_TRANSCRIPT_LENGTH = 60000;

export function validateTranscriptLength(transcript: string): {
  valid: boolean;
  length: number;
  remaining: number;
  error?: string;
} {
  const length = transcript.length;
  const remaining = MAX_TRANSCRIPT_LENGTH - length;

  if (length < 10) {
    return {
      valid: false,
      length,
      remaining,
      error: 'Transcript is too short. Please provide at least 10 characters.',
    };
  }

  if (length > MAX_TRANSCRIPT_LENGTH) {
    return {
      valid: false,
      length,
      remaining,
      error: `Transcript exceeds the maximum limit of ${MAX_TRANSCRIPT_LENGTH.toLocaleString()} characters.`,
    };
  }

  return { valid: true, length, remaining };
}
