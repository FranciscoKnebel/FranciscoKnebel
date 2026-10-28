import { writeFileSync, renameSync, unlinkSync } from 'node:fs';
const enabled = process.env.REFRESH_GITHUB_METRICS === '1';
if (enabled) {
  const headers = {
    Accept: 'application/vnd.github+json',
    'User-Agent': 'FranciscoKnebel-portfolio',
  };
  if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  async function get(path) {
    const response = await fetch(`https://api.github.com${path}`, {
      headers,
      signal: AbortSignal.timeout(10000),
    });
    if (!response.ok) throw new Error(`GitHub returned ${response.status}`);
    return response.json();
  }
  try {
    const profile = await get('/users/FranciscoKnebel');
    const repos = [];
    for (let page = 1; page <= 5; page++) {
      const batch = await get(`/users/FranciscoKnebel/repos?per_page=100&page=${page}`);
      repos.push(...batch);
      if (batch.length < 100) break;
      if (page === 5) throw new Error('Repository pagination limit exceeded');
    }
    const recent = await get('/users/FranciscoKnebel/events/public?per_page=100');
    if (
      profile.login !== 'FranciscoKnebel' ||
      ![profile.public_repos, profile.followers].every(Number.isInteger) ||
      !Array.isArray(recent)
    )
      throw new Error('Unexpected public profile response');
    const languages = new Map();
    for (const repo of repos.filter((repo) => !repo.fork && repo.language))
      languages.set(repo.language, (languages.get(repo.language) || 0) + 1);
    const snapshot = {
      updatedAt: new Date().toISOString(),
      profile: {
        login: profile.login,
        repositories: profile.public_repos,
        followers: profile.followers,
      },
      languages: [...languages]
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 8),
      events: recent.slice(0, 5).map((event) => ({
        id: event.id,
        type: event.type.replace(/Event$/, ''),
        repository: event.repo.name,
        date: event.created_at,
      })),
    };
    const path = 'src/data/github-snapshot.json';
    const temp = `${path}.tmp`;
    try {
      writeFileSync(temp, JSON.stringify(snapshot, null, 2) + '\n');
      renameSync(temp, path);
    } finally {
      try {
        unlinkSync(temp);
      } catch {
        /* no temporary file remains after rename */
      }
    }
    console.log('Public GitHub snapshot refreshed');
  } catch {
    console.warn('GitHub refresh unavailable; using the last committed snapshot.');
  }
}
