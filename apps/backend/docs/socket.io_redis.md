# Socket.io and Redis Adapter

## Redis Adapter v.s. Redis Streams Adapter

Currently, there's two kinds of redis adapter for socket.io.

[Redis adapter][redis-adapter] relies on the Redis [Pub/Sub machanism][pubsub].
We will not going to detail for redis pub/sub,
but one thing good to mention is that,
the adapter can using redis as a boardcast channel to notify other socket.io servers,
so we can solved the issue we mention previously.

For [redis streams adapter][redis-streams-adapter],
most of the functionality same as redis adapter,
but instead of using pub/sub, streams adapter using [streams] under the hood.
The streams adapter can properly handle any temporary disconnection,
and resume the stream without losing any packets.

[redis-adapter]: https://socket.io/docs/v4/redis-adapter/
[redis-streams-adapter]: https://socket.io/docs/v4/redis-streams-adapter/
[pubsub]: https://redis.io/docs/manual/pubsub/
[streams]: https://redis.io/docs/data-types/streams/
