export const calculateHotScore = (ups, downs, date) => {
	// Taken from Reddit's old Hot Score Algorithm

	const score = ups - downs;

	const order = Math.log10(Math.max(Math.abs(score), 1));

	let sign = 0;

	if (score > 0) sign += 1;
	if (score < 0) sign -= 1;

	// Seconds Passed from a Fixed Time
	const seconds = date - 1618055520;
	return Math.round(order + ((sign * seconds) / 45000, 7));
};

export const calculateConfidenceScore = (ups, downs) => {
	// Taken from Reddit's old Comment Confidence Algorithm

	if (ups + downs === 0) return 0;

	const n = ups + downs;
	const z = 1.281551565545;
	const p = ups / n;

	const left = p + (1 / (2 * n)) * z * z;
	const right = z * Math.sqrt((p * (1 - p)) / n + (z * z) / (4 * n * n));
	const under = 1 + (1 / n) * z * z;

	return (left - right) / under;
};

export const calculateScore = (ups, downs) => {
	return ups - downs;
};