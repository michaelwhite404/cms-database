export const arrayCompare = (arr1: Array<any>, arr2: Array<any>) => {
	if (!Array.isArray(arr1) || !Array.isArray(arr2) || arr1.length !== arr2.length) {
		return false;
	}

	// .concat() to not mutate arguments
	const _arr1 = arr1.concat().sort();
	const _arr2 = arr2.concat().sort();

	for (let i = 0; i < arr1.length; i++) {
		if (_arr1[i] !== _arr2[i]) {
			return false;
		}
	}

	return true;
};
