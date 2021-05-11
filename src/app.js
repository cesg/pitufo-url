dotenv.config();
import Fastify from 'fastify';
import Redis from 'ioredis';
import { nanoid } from 'nanoid';
import dotenv from 'dotenv';
import { REDIS_HOST, REDIS_PORT, REDIS_PREFIX } from './config/redis.js';

const fastify = Fastify({
    logger: {
        level: process.env.LOG_LEVEL,
    },
});

const redis = new Redis({
    keyPrefix: REDIS_PREFIX,
    host: REDIS_HOST,
    port: REDIS_PORT,
});
const baseUrl = process.env.APP_URL;

const bodySchema = {
    type: 'object',
    required: ['url'],
    properties: {
        url: {
            type: 'string',
            format: 'uri',
        },
        expired_in: { type: 'integer' },
    },
};

fastify.post('/', { schema: { body: bodySchema } }, async (request) => {
    const id = nanoid();
    const { url, expired_in } = request.body;
    const _url = await redis.get(id);
    if (_url) {
        return { url: `${baseUrl}/${id}` };
    }

    if (expired_in && Number.isInteger(expired_in)) {
        redis.set(id, url, 'EX', expired_in);
    } else {
        redis.set(id, url);
    }

    return { url: `${baseUrl}/${id}` };
});

fastify.get('/redirect/:id', async (request, reply) => {
    const id = request.params.id;
    const url = await redis.get(id);
    if (!url) {
        throw { statusCode: 404 };
    }

    reply.redirect(url);
});

fastify.get('/:id', async (request) => {
    const id = request.params.id;
    const url = await redis.get(id);
    if (!url) {
        throw { statusCode: 404 };
    }

    return { url: url };
});

const start = async () => {
    try {
        await fastify.listen(3000);
    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
};
start();
