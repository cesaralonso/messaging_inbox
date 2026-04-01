import React from 'react';

export const Head = ({ title }: { title?: string }) => {
    if (title) {
        document.title = title;
    }

    return null;
};

export const usePage = () => ({
    url: '/inbox',
    props: {
        auth: {
            user: {
                id: 1,
                name: 'César',
                email: 'cesar@test.com',
            },
            token: 'fake-jwt-token',
        },
    },
});

export const router = {
    visit: jest.fn(),
    get: jest.fn(),
    post: jest.fn(),
};