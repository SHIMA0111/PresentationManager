FROM node:18-slim

# chromium: Browser for Puppeteer
# xvfb: Virtual Frame Buffer for running Chromium in headless mode
RUN apt-get update && apt-get install -y \
    chromium \
    xvfb \
    --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

# Display environment variable for xvfb
ENV DISPLAY=:99

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json/package-lock.json and install dependencies
COPY ../meeting_bot/package*.json ./
RUN npm install

# Copy the project files and authorized profiles to the container
COPY ../meeting_bot/ ./

# xvfb-run: Run Chromium in headless mode
CMD ["xvfb-run", "node", "index.js"]