###################
# BUILD FOR PRODUCTION
###################
FROM node:alpine as build
RUN apk add --no-cache libc6-compat
RUN apk update
WORKDIR /app

COPY . .

RUN yarn install
RUN yarn build

ENV NODE_ENV=production
RUN yarn install --production && yarn cache clean --force

###################
# PRODUCTION
###################
FROM node:alpine as production
RUN addgroup --system --gid 1001 remix
RUN adduser --system --uid 1001 remix
USER remix

COPY --from=build /app/package.json ./package.json
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/build ./build
COPY --from=build /app/public ./public

CMD ["npm", "run", "start"]
