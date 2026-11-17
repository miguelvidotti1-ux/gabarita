import React, { useMemo } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';

interface LatexTextProps {
  text: string;
  className?: string;
}

type Segment =
  | { kind: 'text'; value: string }
  | { kind: 'inline'; value: string }
  | { kind: 'display'; value: string };

function parseLatexSegments(input: string): Segment[] {
  const segments: Segment[] = [];
  let cursor = 0;

  while (cursor < input.length) {
    const idx = input.indexOf('$', cursor);
    if (idx === -1) {
      if (cursor < input.length) {
        segments.push({ kind: 'text', value: input.slice(cursor) });
      }
      break;
    }

    // Ignore escaped \$ (e.g. R\$)
    if (idx > 0 && input[idx - 1] === '\\') {
      const prefix = input.slice(cursor, idx - 1) + '$';
      segments.push({ kind: 'text', value: prefix });
      cursor = idx + 1;
      continue;
    }

    if (idx > cursor) {
      segments.push({ kind: 'text', value: input.slice(cursor, idx) });
    }

    const isDisplay = input[idx + 1] === '$';
    const delimiter = isDisplay ? '$$' : '$';
    const startExpr = idx + delimiter.length;
    const endIdx = input.indexOf(delimiter, startExpr);

    if (endIdx === -1) {
      segments.push({ kind: 'text', value: input.slice(idx) });
      break;
    }

    const expr = input.slice(startExpr, endIdx);
    segments.push({ kind: isDisplay ? 'display' : 'inline', value: expr });
    cursor = endIdx + delimiter.length;
  }

  return segments;
}

export const LatexText: React.FC<LatexTextProps> = ({ text, className = '' }) => {
  const segments = useMemo(() => parseLatexSegments(text || ''), [text]);

  return (
    <span className={className}>
      {segments.map((seg, i) => {
        if (seg.kind === 'text') {
          return (
            <React.Fragment key={i}>
              {seg.value.split('\n').map((line, lineIdx, arr) => (
                <React.Fragment key={lineIdx}>
                  {line}
                  {lineIdx < arr.length - 1 && <br />}
                </React.Fragment>
              ))}
            </React.Fragment>
          );
        }

        const displayMode = seg.kind === 'display';
        const html = katex.renderToString(seg.value, {
          displayMode,
          throwOnError: false,
          strict: false,
        });

        return displayMode ? (
          <span
            key={i}
            className="block my-2 overflow-x-auto py-1"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        ) : (
          <span
            key={i}
            className="inline-block align-middle max-w-full overflow-x-auto"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        );
      })}
    </span>
  );
};

export default LatexText;
