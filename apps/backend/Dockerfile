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

ENV NODE_ENV production
RUN yarn install --production && yarn cache clean --force

###################
# PRODUCTION
###################
FROM node:alpine as production
RUN addgroup --system --gid 1001 nestjs
RUN adduser --system --uid 1001 nestjs
USER nestjs

# Copy the bundled code from the build stage to the production image
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist

RUN ls -la dist

# Start the server using the production build
CMD [ "node", "dist/main.js" ]
