import { config } from './config';

export const checkBlacklistedWords = (text: string): boolean => {
	for (const word of config.blacklistedWords) {
		if (text.includes(word)) {
			return true;
		}
	}
	return false;
};

export const check = (text: string): boolean => {
	return checkBlacklistedWords(text);
};
