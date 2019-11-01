FROM node:10

# Set timezone to Europe/Helsinki
RUN echo "Europe/Helsinki" > /etc/timezone
RUN dpkg-reconfigure -f noninteractive tzdata

# Setup
WORKDIR /usr/src/app
COPY . .

EXPOSE 8000

CMD ["npm", "run", "start:dev"]