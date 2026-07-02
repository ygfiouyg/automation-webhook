FROM node:18-slim
WORKDIR /app
COPY package.json server.js ./
RUN npm install --production
RUN useradd -m -u 1000 appuser && chown -R appuser:appuser /app
USER appuser
EXPOSE 7860
CMD ["node", "server.js"]
