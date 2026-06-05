# ============================================================
#  Stage 1 – CI: install deps, lint, test
# ============================================================
FROM node:22-alpine AS ci

WORKDIR /app

# Copy package files first (layer cache – only reinstalls if deps change)
COPY package.json package-lock.json* ./

RUN npm ci

# Copy source
COPY assets/js/script.js ./assets/js/script.js
COPY eslint.config.js ./
COPY tests/ ./tests/

# Lint
RUN npx eslint assets/js/script.js

# Test
RUN npx jest --ci

# ============================================================
#  Stage 2 – Production: serve static files with nginx
# ============================================================
FROM nginx:alpine AS production

# Remove default nginx page
RUN rm -rf /usr/share/nginx/html/*

# Copy the full site into nginx's serve directory
COPY index.html         /usr/share/nginx/html/
COPY assets/            /usr/share/nginx/html/assets/

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]