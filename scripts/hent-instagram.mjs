// Henter de siste Instagram-postene og lagrer dem i instagram/
// Kjøres av .github/workflows/instagram.yml — se README.md
import { mkdir, writeFile } from 'node:fs/promises';

const TOKEN = process.env.IG_TOKEN;
const ANTALL = 6;
if (!TOKEN) { console.error('Mangler IG_TOKEN. Legg den inn som repository secret.'); process.exit(1); }

const felter = 'id,caption,media_type,media_url,thumbnail_url,permalink,timestamp';
const params = new URLSearchParams({ fields: felter, limit: String(ANTALL), access_token: TOKEN });
const res = await fetch(`https://graph.instagram.com/v21.0/me/media?${params}`);
if (!res.ok) { console.error('Instagram svarte', res.status, await res.text()); process.exit(1); }

const { data = [] } = await res.json();
await mkdir('instagram/bilder', { recursive: true });

const poster = [];
for (const p of data) {
  if (p.media_type === 'VIDEO' && !p.thumbnail_url) continue;
  const erVideo = p.media_type === 'VIDEO';
  const kilde = erVideo ? p.thumbnail_url : p.media_url;
  const fil = `instagram/bilder/${p.id}.jpg`;
  const bilde = await fetch(kilde);
  if (!bilde.ok) { console.warn('Hoppet over', p.id); continue; }
  await writeFile(fil, Buffer.from(await bilde.arrayBuffer()));

  const post = { id: p.id, caption: p.caption ?? '', permalink: p.permalink, timestamp: p.timestamp, bilde: fil, type: p.media_type };

  if (erVideo && p.media_url) {
    const videoFil = `instagram/bilder/${p.id}.mp4`;
    try {
      const video = await fetch(p.media_url);
      if (video.ok) { await writeFile(videoFil, Buffer.from(await video.arrayBuffer())); post.video = videoFil; }
      else console.warn('Fikk ikke lastet ned video for', p.id, video.status);
    } catch (e) { console.warn('Feil ved nedlasting av video for', p.id, e.message); }
  }

  poster.push(post);
}

await writeFile('instagram/posts.json', JSON.stringify(poster, null, 2) + '\n');
console.log('Lagret', poster.length, 'poster.');
