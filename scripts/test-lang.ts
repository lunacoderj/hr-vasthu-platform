import { fetchTranscript } from 'youtube-transcript';

async function testLang() {
  const ids = ['iIlfew9QN5c', 'Py7ktGhYMeE', 'Vt1TCASIxlQ', '9gvLrapR98c'];
  for (const id of ids) {
    try {
      const tr = await fetchTranscript(id);
      console.log(`\nID: ${id}`);
      console.log(tr.slice(0, 3).map(t => t.text).join(' '));
    } catch (e: any) {
      console.log(`ID ${id} error:`, e.message);
    }
  }
}
testLang();
