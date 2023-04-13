import type {Config} from '@jest/types'

export default {
  preset: 'ts-jest',
  clearMocks: true,
  coverageDirectory: "coverage",
  testEnvironment: "jsdom",
  moduleFileExtensions: ['ts', 'js', 'json', 'tsx'],
  moduleDirectories: ['node_modules', 'src'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  // setupFiles: ['./test/setup.js'],
  // 引入jest-enzyme扩展断言支持
  // setupFilesAfterEnv: ['./node_modules/jest-enzyme/lib/index.js'],
  globals: {
    'ts-jest': {
      // 指定ts-jest使用的tsconfig配置
      tsconfig: 'tsconfig.test.json',
    },
  },
} as Config.InitialOptions;
