jest.mock('lucide-react', () => {
    return new Proxy(
        {},
        {
            get: () => () => null,
        }
    );
});

jest.mock('@inertiajs/react', () => ({
    Head: () => null,
    usePage: () => ({
        url: '/inbox',
        props: {},
    }),
    router: {
        visit: jest.fn(),
        get: jest.fn(),
        post: jest.fn(),
    },
}));

jest.mock('@/layouts/inbox-shell-layout', () => ({
    __esModule: true,
    default: ({ children }: { children: React.ReactNode }) => (
        <div data-testid="mock-layout">{children}</div>
    ),
}));

jest.mock('@/features/auth/store/apiAuthStore', () => ({
    useApiAuthStore: jest.fn(),
}));

jest.mock('../../hooks/useConversations', () => ({
    useConversations: jest.fn(),
}));

jest.mock('../../hooks/useConversationDetail', () => ({
    useConversationDetail: jest.fn(),
}));

jest.mock('../../hooks/useUnreadCount', () => ({
    useUnreadCount: jest.fn(),
}));

jest.mock('../../hooks/useReplyToConversation', () => ({
    useReplyToConversation: jest.fn(),
}));

import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import InboxPage from '../InboxPage';

const mockedUseApiAuthStore =
    require('@/features/auth/store/apiAuthStore').useApiAuthStore;
const mockedUseConversations =
    require('../../hooks/useConversations').useConversations;
const mockedUseConversationDetail =
    require('../../hooks/useConversationDetail').useConversationDetail;
const mockedUseUnreadCount =
    require('../../hooks/useUnreadCount').useUnreadCount;
const mockedUseReplyToConversation =
    require('../../hooks/useReplyToConversation').useReplyToConversation;

describe('InboxPage', () => {
    beforeEach(() => {
        mockedUseApiAuthStore.mockImplementation((selector: any) =>
            selector({
                hydrateFromStorage: jest.fn(),
                clearSession: jest.fn(),
                hydrated: true,
                isAuthenticated: true,
                user: {
                    id: 1,
                    name: 'César',
                    email: 'cesar@test.com',
                },
            })
        );

        mockedUseConversations.mockReturnValue({
            items: [
                {
                    id: 1,
                    subject: 'Soporte técnico',
                    status: 'open',
                    unread_count: 1,
                    last_message: {
                        id: 100,
                        body: 'Necesito ayuda con mi acceso',
                        created_at: '2026-03-31T10:00:00.000000Z',
                        sender: {
                            id: 1,
                            name: 'César',
                            email: 'cesar@test.com',
                        },
                    },
                },
                {
                    id: 2,
                    subject: 'Factura pendiente',
                    status: 'closed',
                    unread_count: 0,
                    last_message: {
                        id: 101,
                        body: 'La factura ya fue enviada',
                        created_at: '2026-03-30T10:00:00.000000Z',
                        sender: {
                            id: 2,
                            name: 'Ana',
                            email: 'ana@test.com',
                        },
                    },
                },
            ],
            meta: null,
            isLoading: false,
            error: null,
            reload: jest.fn(),
        });

        mockedUseConversationDetail.mockReturnValue({
            conversation: {
                id: 1,
                subject: 'Soporte técnico',
                status: 'open',
                participants: [
                    { id: 1, name: 'César', email: 'cesar@test.com' },
                    { id: 2, name: 'Ana', email: 'ana@test.com' },
                ],
                messages: [
                {
                    id: 1,
                    body: 'Hola, necesito ayuda',
                    created_at: '2026-03-31T10:00:00.000000Z',
                    sender: {
                    id: 1,
                    name: 'César',
                    email: 'cesar@test.com',
                    },
                },
                ],
            },
            isLoading: false,
            error: null,
            reload: jest.fn(),
        });

        mockedUseUnreadCount.mockReturnValue({
            count: 2,
            isLoading: false,
            reload: jest.fn(),
        });

        mockedUseReplyToConversation.mockReturnValue({
            reply: jest.fn(),
            isSubmitting: false,
            error: null,
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('renderiza la lista de conversaciones', () => {
        render(<InboxPage />);

        expect(screen.getAllByText('Soporte técnico')).toHaveLength(2);
        expect(screen.getByText('Factura pendiente')).toBeInTheDocument();
        expect(
            screen.getByText(/necesito ayuda con mi acceso/i)
        ).toBeInTheDocument();
    });

    it('permite escribir en el buscador', () => {
        render(<InboxPage />);

        const input = screen.getByPlaceholderText(/buscar conversación/i);
        fireEvent.change(input, { target: { value: 'Factura' } });

        expect(input).toHaveValue('Factura');
    });

    it('muestra el detalle de la conversación seleccionada', () => {
        render(<InboxPage />);

        expect(screen.getByText('Hola, necesito ayuda')).toBeInTheDocument();
    });
});