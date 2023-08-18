FROM node:slim
COPY package.json package-lock.json ./
RUN npm -ci install
COPY index.js .
EXPOSE 8081
ENTRYPOINT ["node","index.js"]
