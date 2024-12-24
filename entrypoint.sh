#!bin/sh

npm install sequelize-cli
npm install --force
echo "Migrating Database"

npx sequelize db:migrate
npx sequelize db:seed:all

node -r ./tracing.js server.js
