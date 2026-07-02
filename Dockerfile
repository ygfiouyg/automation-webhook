FROM node:18-slim
WORKDIR /app
COPY package.json server.js ./
RUN npm install --omit=dev
RUN id -u appuser &>/dev/null || useradd -m appuser
USER appuser
EXPOSE 7860
CMD ["node", "server.js"]
