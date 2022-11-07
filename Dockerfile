FROM node:16.15.0-alpine

WORKDIR /opt/app-root/src

COPY . .

ENV USER_NAME=hyper \
    USER_ID=1001 \
    GROUP_ID=0

RUN echo "${USER_NAME}:x:${USER_ID}:${GROUP_ID}:Hypertext Application User:/opt/app-root/:/bin/bash" >> /etc/passwd &\
    chown -R 1001:0 "/opt/app-root"

USER 1001

RUN npm install 

EXPOSE 8080

CMD ["npm", "start"]