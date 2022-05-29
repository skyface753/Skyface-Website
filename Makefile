PROJECT = "SkyBlog Webpage"

all: install docker-start docker-restore

install: ;@echo "Installing NPM ${PROJECT}....."; \
	npm install -C skyface-web
	npm install -C skyface-backend
	npm install -C skyblog_react

docker-start: ;@echo "Starting docker ${PROJECT}....."; \
	docker-compose -f docker-compose-debug.yml up -d

docker-restore: ;@echo "Restoring docker ${PROJECT}....."; \
	docker-compose -f docker-compose-debug.yml exec -T mongo sh -c 'mongorestore --archive' < latest.mongo

docker-backup: ;@echo "Backing up docker ${PROJECT}....."; \
	docker-compose -f docker-compose-debug.yml exec -T mongo sh -c 'mongodump --archive' > latest.mongo