const container = document.getElementById('site-search');
const input = document.getElementById('site-query');
const form = document.getElementById('search-form');
const searchStatus = document.getElementById('search-status');
const results = document.getElementById('search-results');
const labels = JSON.parse(container.dataset.labels);
const language = container.dataset.language;
let engine;
let revision = 0;
let timer;
async function search() {
  const current = ++revision;
  const query = input.value.trim().slice(0, 200);
  results.replaceChildren();
  if (!query) {
    searchStatus.textContent = labels.empty;
    return;
  }
  searchStatus.textContent = labels.loading;
  try {
    const path = `/pagefind/${language}/pagefind.js`;
    engine ??= import(/* @vite-ignore */ path);
    const response = await (await engine).search(query);
    const hits = await Promise.all(response.results.slice(0, 20).map((hit) => hit.data()));
    if (current !== revision) return;
    for (const hit of hits) {
      const url = new URL(hit.url, location.origin);
      if (url.origin !== location.origin) continue;
      const li = document.createElement('li');
      const link = document.createElement('a');
      link.href = url.pathname + url.hash;
      link.className = 'bio-link font-semibold';
      link.textContent = hit.meta.title || url.pathname;
      const excerpt = document.createElement('p');
      excerpt.className = 'mt-1 text-sm text-slate-600 dark:text-slate-300';
      excerpt.textContent = new DOMParser().parseFromString(
        hit.excerpt,
        'text/html',
      ).body.textContent;
      li.append(link, excerpt);
      results.append(li);
    }
    searchStatus.textContent = response.results.length
      ? `${response.results.length} ${labels.count}`
      : labels.none;
  } catch {
    if (current === revision) {
      searchStatus.textContent = labels.error;
      engine = undefined;
    }
  }
}
input.addEventListener('input', () => {
  clearTimeout(timer);
  revision++;
  timer = setTimeout(search, 180);
});
form.addEventListener('submit', (event) => {
  event.preventDefault();
  clearTimeout(timer);
  void search();
});
form.addEventListener('reset', () => {
  clearTimeout(timer);
  revision++;
  results.replaceChildren();
  searchStatus.textContent = labels.empty;
});
input.value = new URLSearchParams(location.search).get('q')?.slice(0, 200) || '';
if (input.value) void search();
