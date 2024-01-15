import { HfInference } from '@huggingface/inference';
import {
	is1DArray,
	cosineSimilarity,
	cosineSimilarityToPercentage,
	dotProductToPercentage,
	calculateMaxDistance,
	distanceToSimilarityPercentage,
	euclideanDistance,
} from '../../../utils/math';

const MODEL = 'llmrails/ember-v1';
// const MODEL = 'Cohere/Cohere-embed-english-v3.0';

export default defineEventHandler(async (event) => {
	const body = await readBody(event);
	if (!body.text1 || !body.text2) {
		throw new Error('Missing text1 or text2');
	}

	const hf = new HfInference(process.env.HF_TOKEN);

	const embedding1 = await hf.featureExtraction({
		model: MODEL,
		inputs: body.text1,
	});
	const embedding1Data = Array.from(embedding1);

	const embedding2 = await hf.featureExtraction({
		model: MODEL,
		inputs: body.text2,
	});
	const embedding2Data = Array.from(embedding2);

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
		model: MODEL,
	};
});
