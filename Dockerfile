FROM node:current-alpine3.22

WORKDIR /home/node/app
RUN chown -R node:node /home/node/app

COPY --chown=node:node package.json .

RUN npm install --verbose

COPY --chown=node:node . .

# At the end, set the user to use when running this image
USER node

CMD npm run start