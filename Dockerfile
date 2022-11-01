From node:latest

COPY . .

WORKDIR /app

RUN npm install

Expose 8080

CMD ["npm", "start"]
