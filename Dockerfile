FROM node:19

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install


COPY . .

#RUN npm run build
# co the build hoac khong build

EXPOSE 8777

CMD ["npm","start","--","--host"]