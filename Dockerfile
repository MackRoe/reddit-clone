from node:12.18.2
# 12.18.2

# not needed as WORKDIR makes the directory automatically
# RUN mkdir -p /usr/src/reddit-clone

WORKDIR /usr/src/reddit-clone

# Install app dependencies
COPY package*.json ./

RUN cd /usr/src/reddit-clone && npm install

# bundle app source
COPY . /usr/src/reddit-clone

# Tell docker daemon to map app to port 3000
EXPOSE 3000

# Launch the wait tool, then launch the app
# Source: https://dev.to/hugodias/wait-for-mongodb-to-start-on-docker-3h8b
ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.2.1/wait /wait
RUN chmod +x /wait

CMD /wait && npm start

# 2020-03-04T23_58_37_420Z-debug.log 2020-07-11T19_08_47_621Z-debug.log
