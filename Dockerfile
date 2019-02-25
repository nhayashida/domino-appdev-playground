FROM node:10.15.1-alpine

ENV SERVICE_USER=app
ENV APP_DIR=/home/$SERVICE_USER/domino-appdev-playground

RUN adduser -D -g '' $SERVICE_USER
ADD --chown=app:app . $APP_DIR

WORKDIR $APP_DIR
USER $SERVICE_USER
EXPOSE 3000

CMD ["npm", "run", "start"]
