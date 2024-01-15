import { pipeline } from '@xenova/transformers';
import {
	is1DArray,
	cosineSimilarity,
	cosineSimilarityToPercentage,
	dotProductToPercentage,
	calculateMaxDistance,
	distanceToSimilarityPercentage,
	euclideanDistance,
} from '../../../utils/math';

const TASK_NAME = 'feature-extraction';

export default defineEventHandler(async (event) => {
	const body = await readBody(event);
	if (!body.text1 || !body.text2) {
		throw new Error('Missing text1 or text2');
	}
	let generateEmbeddings = await pipeline(TASK_NAME);

	const embedding1 = await generateEmbeddings(body.text1, {
		pooling: 'mean',
		normalize: true,
	});
	const embedding1Data = Array.from(embedding1.data);

	const embedding2 = await generateEmbeddings(body.text2, {
		pooling: 'mean',
		normalize: true,
	});
	const embedding2Data = Array.from(embedding2.data);
	console.log(embedding1Data, embedding2Data);

	if (!is1DArray(embedding1Data) || !is1DArray(embedding2Data)) {
		throw new Error('Embeddings must be 1D arrays');
	}

	const cosSimilarity = cosineSimilarityToPercentage(
		cosineSimilarity(embedding1Data, embedding2Data)
	);

	const dotSimilarity = dotProductToPercentage(embedding1Data, embedding2Data);

	const numDimensions = embedding1Data.length;
	const maxDistance = calculateMaxDistance(numDimensions);
	const euclidSimilarity = distanceToSimilarityPercentage(
		euclideanDistance(embedding1Data, embedding2Data),
		maxDistance
	);

	return {
		cosSimilarity,
		dotSimilarity,
		euclidSimilarity,
	};
});
