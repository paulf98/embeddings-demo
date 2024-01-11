import { pipeline } from '@xenova/transformers';
import cosineSimilarity from 'compute-cosine-similarity';

export default defineEventHandler(async (event) => {
	const body = await readBody(event);

	let generateEmbeddings = await pipeline('feature-extraction');

	const embedding1 = await generateEmbeddings(body.text1, {
		pooling: 'mean',
		normalize: true,
	});
	const embedding1Data = Array.from(embedding1.data);

	const embedding2 = await generateEmbeddings(body.text1, {
		pooling: 'mean',
		normalize: true,
	});
	const embedding2Data = Array.from(embedding2.data);
	console.log(embedding1Data, embedding2Data);

	let similarity = null;
	if (is1DArray(embedding1Data) && is1DArray(embedding2Data)) {
		// similarity = cosineSimilarity(embedding1Data, embedding2Data);
		similarity = dotProduct(embedding1Data, embedding2Data);
	}

	return similarity;
});

function is1DArray<T>(value: (T | T[] | T[][])[]): value is T[] {
	return !Array.isArray(value[0]);
}

function dotProduct(a: any[], b: any[]) {
	return a.map((x, i) => a[i] * b[i]).reduce((m, n) => m + n);
}