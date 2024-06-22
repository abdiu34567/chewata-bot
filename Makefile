.PHONY: build clean start 

.DEFAULT_GOAL := dev

# Define the commands
prod: install build
	@printf "Making Production \n"
	pm2 restart telegram-bot

start:
	@printf "Started the server \n"
	node dist/src/index.js

install:
	@printf "Installing Dependancies \n"
	npm install

dev:
	@printf "Running Devmode \n"
	nodemon

test:
	jest

build:
	@printf "Building New Changes \n"
	npm run clean && tsc

clean:
	@printf "Cleaning dist files \n"
	rm -rf dist/*

redis-start:
	docker-compose up -d

redis-stop:
	docker-compose down
