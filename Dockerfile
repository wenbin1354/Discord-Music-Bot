FROM node:16.14

ENV USER=musicbot

# create musicbot user
RUN groupadd -r ${USER} && \
	useradd --create-home --home /home/musicbot -r -g ${USER} ${USER}

# set up
USER ${USER}
WORKDIR /home/musicbot

COPY --chown=${USER}:${USER} package*.json ./
RUN npm install
VOLUME [ "/home/musicbot" ]

COPY --chown=${USER}:${USER}  . .

ENTRYPOINT [ "npm", "run", "prod" ]