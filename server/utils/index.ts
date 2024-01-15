const is1DArray = <T>(value: (T | T[] | T[][])[]): value is T[] => {
	return !Array.isArray(value[0]);
};

function dotProduct(vectorA: number[], vectorB: number[]): number {
	if (vectorA.length !== vectorB.length) {
		throw new Error('Vectors must be of the same dimension');
	}

	let product = 0;
	for (let i = 0; i < vectorA.length; i++) {
		product += vectorA[i] * vectorB[i];
	}
	return product;
}

function magnitude(vec: number[]): number {
	return Math.sqrt(vec.reduce((sum, value) => sum + value * value, 0));
}

function normalizeVector(vector: number[]): number[] {
	const magnitude = Math.sqrt(vector.reduce((acc, val) => acc + val * val, 0));
	return vector.map((val) => val / magnitude);
}

function dotProductToPercentage(vectorA: number[], vectorB: number[]): number {
	const normalizedA = normalizeVector(vectorA);
	const normalizedB = normalizeVector(vectorB);
	const cosineSimilarity = dotProduct(normalizedA, normalizedB);
	return ((cosineSimilarity + 1) / 2) * 100; // Adjusted for range [-1, 1]
}

function cosineSimilarity(vec1: number[], vec2: number[]): number {
	if (vec1.length !== vec2.length) {
		throw new Error(
			'Beide Vektoren müssen dieselbe Anzahl an Dimensionen haben.'
		);
	}

	const dotProd = dotProduct(vec1, vec2);
	const magnitudeProd = magnitude(vec1) * magnitude(vec2);

	if (magnitudeProd === 0) {
		throw new Error('Einer der Vektoren hat eine Länge von 0.');
	}

	return dotProd / magnitudeProd;
}

function cosineSimilarityToPercentage(
	cosineSimilarity: number,
	considerNegativeValues: boolean = false
): number {
	if (considerNegativeValues) {
		// Scale from [-1, 1] to [0, 1]
		return ((cosineSimilarity + 1) / 2) * 100;
	} else {
		// Direct scaling for [0, 1]
		return cosineSimilarity * 100;
	}
}

function euclideanDistance(point1: number[], point2: number[]): number {
	if (point1.length !== point2.length) {
		throw new Error(
			'Beide Punkte müssen dieselbe Anzahl an Dimensionen haben.'
		);
	}

	let sum = 0;
	for (let i = 0; i < point1.length; i++) {
		sum += (point1[i] - point2[i]) ** 2;
	}

	return Math.sqrt(sum);
}

// Function to normalize the Euclidean distance
function normalizeDistance(distance: number, maxDistance: number): number {
	return distance / maxDistance;
}

// Function to convert normalized distance to similarity percentage
function distanceToSimilarityPercentage(
	distance: number,
	maxDistance: number
): number {
	const normalizedDistance = normalizeDistance(distance, maxDistance);
	return (1 - normalizedDistance) * 100;
}

function calculateMaxDistance(numDimensions: number): number {
	return Math.sqrt(numDimensions);
}
