import { ImageResponse } from '@vercel/og';
import { writeFile, mkdir } from 'node:fs/promises';
import { join } from 'node:path';

const html = {
  type: 'div',
  props: {
    style: {
      height: '100%',
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#05080F',
      backgroundImage:
        'radial-gradient(ellipse 80% 60% at 50% 45%, rgba(34, 211, 238, 0.18) 0%, rgba(5, 8, 15, 0) 60%)',
      padding: 80,
    },
    children: [
      {
        type: 'div',
        props: {
          style: { display: 'flex', fontSize: 160, fontWeight: 700, letterSpacing: '-0.04em', color: '#F8FAFC', lineHeight: 1 },
          children: [
            'JAG',
            { type: 'span', props: { style: { color: '#22D3EE' }, children: '.' } },
          ],
        },
      },
      {
        type: 'div',
        props: {
          style: { marginTop: 32, fontSize: 36, color: '#CBD5E1', textAlign: 'center', maxWidth: 900, lineHeight: 1.2 },
          children: 'Sovereign Agentic AI Cybersecurity.',
        },
      },
      {
        type: 'div',
        props: {
          style: { marginTop: 12, fontSize: 28, color: '#22D3EE', textAlign: 'center', fontFamily: 'monospace' },
          children: 'Zero cloud · Zero exfiltration · Zero trust',
        },
      },
    ],
  },
};

const res = new ImageResponse(html, { width: 1200, height: 630 });
const buf = Buffer.from(await res.arrayBuffer());
const outDir = join(process.cwd(), 'public');
await mkdir(outDir, { recursive: true });
const outPath = join(outDir, 'og.png');
await writeFile(outPath, buf);
console.log(`OG image written: ${outPath} (${buf.length} bytes)`);
