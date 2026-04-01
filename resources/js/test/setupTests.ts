

jest.mock('lucide-react', () => {
    return new Proxy(
        {},
        {
            get: () => () => null,
        }
    );
});

import '@testing-library/jest-dom';