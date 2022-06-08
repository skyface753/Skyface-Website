PROJECT = "SkyBlog Webpage"

start: install docker-start docker-restore

end: move-backup docker-backup

build: install reactjs-build docker-build-web docker-build-backend

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

move-backup: ;@echo "Moving backup to folder with date-name....."; \
	mv latest.mongo mongo-backup/`date +%Y-%m-%d`.mongo

reactjs-build: ;@echo "Building reactjs ${PROJECT}....."; \
	npm install -C skyface-web
	npm run build -C skyface-web

docker-build-web: ;@echo "Building docker ${PROJECT}....."; \
	docker build -t skyface753/skyblog-web ./skyface-web

docker-build-backend: ;@echo "Building docker ${PROJECT}....."; \
	docker build -t skyface753/skyblog-backend ./skyface-backend