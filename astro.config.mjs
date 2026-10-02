import { defineConfig } from 'astro/config';

// На GitHub Actions адрес сайта вычисляется автоматически из имени репозитория:
//   репозиторий  vasya/family-cookbook  →  https://vasya.github.io/family-cookbook/
//   репозиторий  vasya/vasya.github.io  →  https://vasya.github.io/
// Локально сайт открывается с корня (http://localhost:4321/).
const [owner, repo] = (process.env.GITHUB_REPOSITORY ?? '').split('/');
const isUserSite = repo && repo.toLowerCase() === `${owner}.github.io`.toLowerCase();

export default defineConfig({
  site: owner ? `https://${owner}.github.io` : undefined,
  base: repo && !isUserSite ? `/${repo}` : '/',
  trailingSlash: 'ignore',
});
