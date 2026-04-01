import React from 'react';
import { createInertiaApp } from '@inertiajs/react';
import { createRoot } from 'react-dom/client';
import { TooltipProvider } from '@/components/ui/tooltip';
import { initializeTheme } from '@/hooks/use-appearance';

type PageModule = {
    default: React.ComponentType<any>;
};

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

const pages = import.meta.glob<PageModule>([
    './pages/**/*.tsx',
    '!./pages/settings/**/*.tsx',
]);

createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),

    resolve: async (name) => {
        const importPage = pages[`./pages/${name}.tsx`];

        if (!importPage) {
            throw new Error(`Page not found: ${name}`);
        }

        const page = await importPage();
        return page.default;
    },

    setup({ el, App, props }) {
        createRoot(el).render(
            <TooltipProvider delayDuration={0}>
                <App {...props} />
            </TooltipProvider>
        );
    },

    progress: {
        color: '#4B5563',
    },
});

initializeTheme();