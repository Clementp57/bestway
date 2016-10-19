FROM debian:jessie

RUN apt-get update \
&& apt-get install -y curl \
&& rm -rf /var/lib/apt/lists/*

RUN curl -LO "https://nodejs.org/dist/v4.5.0/node-v4.5.0-linux-x64.tar.gz" \
&& tar -xzf node-v4.5.0-linux-x64.tar.gz -C /usr/local --strip-components=1 \
&& rm node-v4.5.0-linux-x64.tar.gz

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package.json /usr/src/app/

# Install app dependencies
RUN npm -v
RUN npm install -v
RUN ls -la node_modules

# Bundle app source
COPY . /usr/src/app

EXPOSE 5000
CMD [ "node", "server.js" ]
