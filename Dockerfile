FROM node:slim
# RUN apt-get install g++

RUN npm install -g npm@latest

WORKDIR /src
COPY . .
EXPOSE 3000
ENV NODE_ENV=development
# RUN apt-get update && apt-get install gnupg wget -y && \
#   wget --quiet --output-document=- https://dl-ssl.google.com/linux/linux_signing_key.pub | gpg --dearmor > /etc/apt/trusted.gpg.d/google-archive.gpg && \
#   sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' && \
#   apt-get update && \
#   apt-get install google-chrome-stable -y --no-install-recommends && \
#   rm -rf /var/lib/apt/lists/*
RUN npm install -g nodemon && npm install
RUN node ./node_modules/whatsapp-web.js/node_modules/puppeteer/install.js
CMD ["nodemon", "index.js"]