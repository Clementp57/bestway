FROM debian:jessie

RUN apt-get update \
&& apt-get install -y curl \
&& rm -rf /var/lib/apt/lists/*

RUN curl -LO "https://nodejs.org/dist/v4.5.0/node-v4.5.0-linux-x64.tar.gz" \
&& tar -xzf node-v4.5.0-linux-x64.tar.gz -C /usr/local --strip-components=1 \
&& rm node-v4.5.0-linux-x64.tar.gz

# Create app directory
ADD package.json /app/
WORKDIR /app

# Install app dependencies
RUN npm install -v

# Bundle app source
COPY . /app

EXPOSE 5000
CMD [ "node", "scheduler.js" ]
