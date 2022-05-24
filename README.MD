# BACKUP

docker-compose -f docker-compose-debug.yml exec -T mongo sh -c 'mongodump --archive' > compose-backup
docker-compose -f docker-compose-debug.yml exec -T mongo sh -c 'mongorestore --archive' < 