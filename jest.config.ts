import { pathsToModuleNameMapper } from 'ts-jest';
import { compilerOptions } from './tsconfig.json';

/** @type {import('ts-jest').JestConfigWithTsJest} */
const config = {
	clearMocks: true,
	coverageProvider: 'v8',
	preset: 'ts-jest/presets/js-with-ts',
	setupFiles: ['dotenv/config'],
	transform: {
		'^.+\\.mjs$': 'ts-jest',
	},
	// https://kulshekhar.github.io/ts-jest/docs/getting-started/paths-mapping/
	roots: ['<rootDir>'],
	modulePaths: [compilerOptions.baseUrl],
	moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths),
};

export default config;
