FROM node:24-alpine

WORKDIR /m1p13mean-backend

COPY package*.json ./

RUN npm ci

COPY . .

CMD ["npm", "run", "dev"]