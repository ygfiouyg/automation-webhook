FROM node:18-slim
WORKDIR /app
COPY package.json server.js ./
RUN npm install --omit=dev
# HF Spaces: node:18-slim already has 'node' user (UID 1000)
USER node
EXPOSE 7860
CMD ["node", "server.js"]
