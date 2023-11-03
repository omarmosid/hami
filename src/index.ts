/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

import { check } from './main';

export interface Env {
	// Example binding to KV. Learn more at https://developers.cloudflare.com/workers/runtime-apis/kv/
	// MY_KV_NAMESPACE: KVNamespace;
	//
	// Example binding to Durable Object. Learn more at https://developers.cloudflare.com/workers/runtime-apis/durable-objects/
	// MY_DURABLE_OBJECT: DurableObjectNamespace;
	//
	// Example binding to R2. Learn more at https://developers.cloudflare.com/workers/runtime-apis/r2/
	// MY_BUCKET: R2Bucket;
	//
	// Example binding to a Service. Learn more at https://developers.cloudflare.com/workers/runtime-apis/service-bindings/
	// MY_SERVICE: Fetcher;
	//
	// Example binding to a Queue. Learn more at https://developers.cloudflare.com/queues/javascript-apis/
	// MY_QUEUE: Queue;
}

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		const text = await getText(request);
		if (!text) {
			return new Response(
				JSON.stringify({
					isSus: false,
					comment: 'No text supplied.',
				}),
				{
					headers: {
						'content-type': 'application/json;charset=UTF-8',
					},
				}
			);
		}
		const isSus = check(text);
		const response = {
			isSus: isSus,
			comment: 'This comment has been flagged for being suspicious.',
		};
		return new Response(JSON.stringify(response), {
			headers: {
				'content-type': 'application/json;charset=UTF-8',
			},
		});
	},
};

async function getText(request: Request) {
	console.log('cf', request.cf);
	const contentType = request.headers.get('content-type') || '';
	if (contentType.includes('application/json')) {
		const jsonText: any = await request.json();
		const text = jsonText['text'] || '';
		console.log('text', text);
		return text;
	} else {
		return '';
	}
}
