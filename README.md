# Revyva Careers – Marketing SPA

Host this folder with GitHub Pages for revyva.careers (or any custom domain).

## Deploying to GitHub Pages

1. Create a new repository named `revyva-site` (or use your existing one).
2. Push this folder's contents to that repo.
3. In the repo Settings → Pages:
	- Source: Deploy from a branch
	- Branch: `main` (or `gh-pages`), Folder: `/ (root)`
4. If using a custom domain (revyva.careers), set it in Pages and add a CNAME record at your DNS pointing to `<username>.github.io`.

## Custom domain (revyva.careers)

- DNS: CNAME `revyva.careers` → `<username>.github.io`.
- GitHub Pages: set Custom domain to `revyva.careers`. GitHub will handle SSL.

## Notes

- Asset paths in `index.html` are relative, so it works both at root and with a custom domain.
- Replace `assets/og-revyva.png` with your real OG image for social sharing.
- Update the GUMROAD_URL in `index.html` with your product link.