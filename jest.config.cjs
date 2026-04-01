module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/resources/js'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  testMatch: [
    '**/__tests__/**/*.(test|spec).(ts|tsx)',
    '**/?(*.)+(test|spec).(ts|tsx)',
  ],
  setupFilesAfterEnv: ['<rootDir>/resources/js/test/setupTests.ts'],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '^@/(.*)$': '<rootDir>/resources/js/$1',
    '^@inertiajs/react$': '<rootDir>/resources/js/test/mocks/inertia-react.tsx',
  },
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  testPathIgnorePatterns: ['/node_modules/', '/public/', '/vendor/'],
  transformIgnorePatterns: [
    '/node_modules/(?!(lucide-react)/)',
  ],
};