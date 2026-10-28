/* Public GitHub profile data; no credentials are used in the browser. */
(() => {
  const section = document.querySelector('[data-github-stats]');
  if (!section) return;
  const status = section.querySelector('[data-github-status]');
  const recent = section.querySelector('[data-github-recent]');
  const cacheKey = 'portfolio:github:t3hj:v1';
  const ttl = 15 * 60 * 1000;
  const valid = (data) => data && Number.isFinite(data.savedAt) && data.savedAt > 0
    && ['repos', 'stars', 'forks', 'followers'].every(key => Number.isSafeInteger(data[key]) && data[key] >= 0)
    && Array.isArray(data.recent) && data.recent.every(repo => repo && typeof repo.name === 'string'
      && typeof repo.description === 'string' && typeof repo.language === 'string');
  const timeLabel = (value) => new Date(value).toLocaleString(undefined, {dateStyle: 'medium', timeStyle: 'short'});
  const render = (data, saved = false) => {
    for (const key of ['repos', 'stars', 'forks', 'followers']) {
      section.querySelector('[data-github-' + key + ']').textContent = data[key].toLocaleString();
    }
    recent.replaceChildren();
    for (const repo of data.recent) {
      const item = document.createElement('li');
      const link = document.createElement('a');
      link.href = 'https://github.com/t3hj/' + encodeURIComponent(repo.name);
      link.target = '_blank';
      link.rel = 'noreferrer';
      link.textContent = repo.name;
      item.appendChild(link);
      if (repo.language) {
        const language = document.createElement('span');
        language.className = 'github-repo-language';
        language.textContent = repo.language;
        item.appendChild(language);
      }
      if (repo.description) {
        const description = document.createElement('p');
        description.textContent = repo.description;
        item.appendChild(description);
      }
      recent.appendChild(item);
    }
    if (!data.recent.length) {
      const item = document.createElement('li');
      item.textContent = 'Explore my repositories on GitHub.';
      recent.appendChild(item);
    }
    status.textContent = (saved ? 'Showing saved data from ' : 'Updated ') + timeLabel(data.savedAt)
      + (saved ? '. Live refresh is unavailable.' : ' · Refreshes every 15 minutes on your next visit.');
    section.setAttribute('aria-busy', 'false');
  };
  const request = async (url, signal) => {
    const response = await fetch(url, {
      headers: {Accept: 'application/vnd.github+json'},
      signal,
      credentials: 'omit'
    });
    if (!response.ok) throw new Error('GitHub request failed: ' + response.status);
    return response.json();
  };
  const load = async () => {
    let cached;
    try { cached = JSON.parse(localStorage.getItem(cacheKey)); } catch {}
    if (!valid(cached)) cached = null;
    if (cached && Date.now() - cached.savedAt >= 0 && Date.now() - cached.savedAt < ttl) {
      render(cached);
      return;
    }
    section.setAttribute('aria-busy', 'true');
    status.textContent = 'Loading public data from GitHub…';
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000);
    try {
      const [user, firstPage] = await Promise.all([
        request('https://api.github.com/users/t3hj', controller.signal),
        request('https://api.github.com/users/t3hj/repos?per_page=100&type=owner&sort=pushed&page=1', controller.signal)
      ]);
      if (!Number.isSafeInteger(user.public_repos) || !Number.isSafeInteger(user.followers) || !Array.isArray(firstPage)) {
        throw new Error('Invalid GitHub response');
      }
      let repos = [...firstPage];
      let page = firstPage;
      for (let number = 2; page.length === 100; number += 1) {
        if (number > 20) throw new Error('Repository pagination limit reached');
        page = await request('https://api.github.com/users/t3hj/repos?per_page=100&type=owner&sort=pushed&page=' + number, controller.signal);
        if (!Array.isArray(page)) throw new Error('Invalid repository response');
        repos.push(...page);
      }
      repos = [...new Map(repos.map(repo => [repo.id, repo])).values()];
      if (repos.length !== user.public_repos || repos.some(repo =>
        !Number.isSafeInteger(repo.stargazers_count) || !Number.isSafeInteger(repo.forks_count))) {
        throw new Error('Incomplete repository totals');
      }
      const data = {
        savedAt: Date.now(),
        repos: user.public_repos,
        followers: user.followers,
        stars: repos.reduce((sum, repo) => sum + repo.stargazers_count, 0),
        forks: repos.reduce((sum, repo) => sum + repo.forks_count, 0),
        recent: repos.filter(repo => !repo.fork && !repo.archived)
          .sort((a, b) => (Date.parse(b.pushed_at) || 0) - (Date.parse(a.pushed_at) || 0))
          .slice(0, 3).map(repo => ({
            name: repo.name, description: repo.description || '', language: repo.language || ''
          }))
      };
      if (!valid(data)) throw new Error('Invalid statistics');
      render(data);
      try { localStorage.setItem(cacheKey, JSON.stringify(data)); } catch {}
    } catch {
      if (cached) render(cached, true);
      else {
        status.textContent = 'Live stats are temporarily unavailable. View the latest numbers on my GitHub profile.';
        recent.replaceChildren();
        section.setAttribute('aria-busy', 'false');
      }
    } finally {
      clearTimeout(timeout);
    }
  };
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) { observer.disconnect(); load(); }
    }, {rootMargin: '300px'});
    observer.observe(section);
  } else load();
})();
