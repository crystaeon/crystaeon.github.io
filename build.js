const fs = require('fs');
const path = require('path');

function parseFrontmatter(md) {
  const match = md.match(/^---\s*([\s\S]*?)\s*---\s*([\s\S]*)$/);
  if (!match) return { meta: {}, content: md };
  const yaml = match[1];
  const content = match[2];
  const meta = {};
  let inImages = false;
  meta.images = [];
  yaml.split('\n').forEach(line => {
    if (/^\s*#/.test(line) || !line.trim()) return;
    if (line.trim().startsWith('images:')) { inImages = true; return; }
    if (inImages && line.trim().startsWith('-')) { meta.images.push(line.replace(/-\s*/, '').trim()); return; }
    inImages = false;
    const [key, ...rest] = line.split(':');
    if (key && rest.length) meta[key.trim()] = rest.join(':').trim();
  });
  return { meta, content };
}

(async () => {
  const { marked } = await import('marked');
  const postsDir = path.join(__dirname, 'posts');
  const postFiles = fs.readdirSync(postsDir).filter(f => f.endsWith('.md'));
  let allPostsHtml = '';
  postFiles.forEach((file, idx) => {
    const md = fs.readFileSync(path.join(postsDir, file), 'utf8');
    const { meta, content } = parseFrontmatter(md);
    let dateStr = '';
    if (meta.date && /^\d{4}-\d{2}-\d{2}$/.test(meta.date)) {
      const [y, m, d] = meta.date.split('-');
      dateStr = `<span class='post-date'>${d}${m}${y}</span>\n`;
    }
    let html = dateStr + marked.parse(content.trim());
    if (meta.images && meta.images.length) {
      html += `<div class='image-grid'>`;
      meta.images.forEach(src => {
        html += `<div class='image-grid-item'><img src='${src}'></div>`;
      });
      html += `</div>`;
    }
    allPostsHtml += `<article class="post" id="post-${idx}">${html}</article>\n`;
  });
  const indexPath = path.join(__dirname, 'index.html');
  let indexHtml = fs.readFileSync(indexPath, 'utf8');
  indexHtml = indexHtml.replace(
    /<main id="content">[\s\S]*?<\/main>/,
    `<main id="content">\n${allPostsHtml}</main>`
  );
  fs.writeFileSync(indexPath, indexHtml);
  console.log('Posts injected into index.html!');
})(); 