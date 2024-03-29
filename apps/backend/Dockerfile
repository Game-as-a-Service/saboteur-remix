###################
# BUILD FOR PRODUCTION
###################

FROM node:lts-alpine as builder
RUN apk add --no-cache libc6-compat
RUN apk update

# Set working directory
WORKDIR /app
RUN yarn global add turbo
COPY . .
RUN turbo prune --scope=backend --docker

# Add lockfile and package.json's of isolated subworkspace
FROM node:lts-alpine AS installer
RUN apk add --no-cache libc6-compat
RUN apk update
WORKDIR /app

# First install the dependencies (as they change less often)
COPY .gitignore .gitignore
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/yarn.lock ./yarn.lock
RUN yarn install

# Build the project
COPY --from=builder /app/out/full/ .
RUN yarn turbo run build --filter=backend...

###################
# PRODUCTION
###################
FROM node:lts-alpine as production
RUN addgroup --system --gid 1001 nestjs
RUN adduser --system --uid 1001 nestjs
USER nestjs

# Copy the bundled code from the build stage to the production image
COPY --from=installer /app/node_modules ./node_modules
COPY --from=installer /app/apps/backend/dist ./dist

# Start the server using the production build
CMD [ "node", "dist/main.js" ]
