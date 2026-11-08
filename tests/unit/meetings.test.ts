import { describe, it, expect } from 'vitest';
import {
  stripSubtitleTimestamps,
  validateTranscriptLength,
  MAX_TRANSCRIPT_LENGTH,
} from '@/features/meetings/parser';

describe('Meeting transcript subtitle parser', () => {
  it('strips standard WebVTT timestamps and voice tags', () => {
    const vttInput = `WEBVTT - Sales Call Transcript

1
00:00:01.000 --> 00:00:04.200
<v Sarah>Hi everyone, thanks for joining today's demo.</v>

2
00:00:04.500 --> 00:00:09.100 position:10% align:start
<v Marcus>Thanks Sarah, we are eager to see Cadre's revenue forecasting features.</v>
`;

    const expected = `Sarah: Hi everyone, thanks for joining today's demo.
Marcus: Thanks Sarah, we are eager to see Cadre's revenue forecasting features.`;

    const cleaned = stripSubtitleTimestamps(vttInput);
    expect(cleaned).toBe(expected);
  });

  it('strips SubRip (.srt) timestamps and sequential cue numbers', () => {
    const srtInput = `1
00:00:02,150 --> 00:00:05,800
Sarah: Could you explain your security compliance certification?

2
00:00:06,000 --> 00:00:10,500
<i>Marcus: We are SOC2 Type II certified and host on Supabase with strict RLS.</i>
`;

    const expected = `Sarah: Could you explain your security compliance certification?
Marcus: We are SOC2 Type II certified and host on Supabase with strict RLS.`;

    const cleaned = stripSubtitleTimestamps(srtInput);
    expect(cleaned).toBe(expected);
  });

  it('strips NOTE and STYLE blocks in WebVTT', () => {
    const vttInput = `WEBVTT

NOTE This is a commentary note from Zoom
which continues across lines

STYLE
::cue {
  background-color: rgba(0, 0, 0, 0.8);
}

00:01:00.000 --> 00:01:03.000
Action item: Sarah to send over master services agreement by Friday.
`;

    const expected = 'Action item: Sarah to send over master services agreement by Friday.';
    const cleaned = stripSubtitleTimestamps(vttInput);
    expect(cleaned).toBe(expected);
  });

  it('deduplicates consecutive identical lines common in live streaming transcription', () => {
    const liveStreamInput = `1
00:00:01.000 --> 00:00:02.000
We need to finalize the contract

2
00:00:02.000 --> 00:00:03.000
We need to finalize the contract

3
00:00:03.500 --> 00:00:05.000
before the end of Q3.
`;

    const cleaned = stripSubtitleTimestamps(liveStreamInput);
    expect(cleaned).toBe(`We need to finalize the contract
before the end of Q3.`);
  });

  it('leaves clean plain text untouched', () => {
    const plainInput = `Sarah (VP Sales): We loved the product demo today.
Marcus (Head of RevOps): We will review pricing with procurement tomorrow.`;

    const cleaned = stripSubtitleTimestamps(plainInput);
    expect(cleaned).toBe(plainInput);
  });

  it('validates transcript character counts against 60,000 limit', () => {
    expect(validateTranscriptLength('Short').valid).toBe(false);
    expect(validateTranscriptLength('A'.repeat(50)).valid).toBe(true);

    const oversized = 'A'.repeat(MAX_TRANSCRIPT_LENGTH + 1);
    const oversizedResult = validateTranscriptLength(oversized);
    expect(oversizedResult.valid).toBe(false);
    expect(oversizedResult.remaining).toBe(-1);
  });
});

