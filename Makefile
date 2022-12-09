PROJECT = "SkyBlog Webpage"

build: build-react copy-react-build

full: build docker-start

build-react: ;@echo "Building React..."
	npm install -C skyface-web
	npm run build -C skyface-web

copy-react-build: ;@echo "Copying React build..."
	mkdir -p skyface-backend/react_build
	rm -r -f skyface-backend/react_build/*
	mv skyface-web/build/* skyface-backend/react_build

update: ;@echo "Updating ReactJS and NodeJS..."
	npm update -C skyface-web
	npm update -C skyface-backend

docker-start:
	docker-compose up -d --build

backup: move-backup docker-backup delete-old-backups backup-files

delete-old-backups: ;@echo "Delete old Backups"; \
	find ./mongo-backup/ -type f -mtime +30 -name '*.mongo' -execdir rm -- '{}' \;

backup-files:
	zip -r files-backup.zip files

restore: ;@echo "Restoring docker ${PROJECT}....."; \
	docker-compose -f docker-compose-debug.yml exec -T mongo sh -c 'mongorestore --archive' < latest.mongo

docker-backup: ;@echo "Backing up docker ${PROJECT}....."; \
	docker-compose exec -T mongo sh -c 'mongodump --archive' > latest.mongo

move-backup: ;@echo "Moving backup to folder with date-name....."; \
	mkdir -p mongo-backup
	mv latest.mongo mongo-backup/`date +%Y-%m-%d`.mongo

# reactjs-build: ;@echo "Building reactjs ${PROJECT}....."; \
# 	npm install -C skyface-web
# 	npm run build -C skyface-web

# build-web: ;@echo "Installing reactjs ${PROJECT}....."; \
# 	npm install -C skyface-web
# 	npm run build -C skyface-web

# docker-build-web: ;@echo "Building docker ${PROJECT}....."; \
# 	# docker build -t skyface753/skyblog-web ./skyface-web
# 	docker buildx build --push --platform linux/arm/v7,linux/arm64/v8,linux/amd64 -t skyface753/skyblog-web ./skyface-web
# docker-build-backend: ;@echo "Building docker ${PROJECT}....."; \
# 	# docker build -t skyface753/skyblog-backend ./skyface-backend
# 	docker buildx build --push --platform linux/arm/v7,linux/arm64/v8,linux/amd64 -t skyface753/skyblog-backend ./skyface-backend