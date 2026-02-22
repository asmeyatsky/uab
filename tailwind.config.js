/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                background: '#050510',
                primary: '#00f3ff',
                secondary: '#bc13fe',
                surface: 'rgba(255, 255, 255, 0.05)',
                'surface-hover': 'rgba(255, 255, 255, 0.1)',
                // Protocol colors
                'proto-mcp': '#D97706',
                'proto-a2a': '#3B82F6',
                'proto-adk': '#10B981',
                'proto-acp': '#8B5CF6',
                'proto-ucp': '#EC4899',
                'proto-ap2': '#F59E0B',
                'proto-tap': '#1A1F71',
                'proto-a2ui': '#06B6D4',
                'proto-agui': '#EF4444',
                'proto-toon': '#14B8A6',
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                mono: ['JetBrains Mono', 'monospace'],
            },
            animation: {
                'glow': 'glow 2s ease-in-out infinite alternate',
                'glow-purple': 'glow-purple 2s ease-in-out infinite alternate',
                'slide-up': 'slide-up 0.3s ease-out',
                'fade-in': 'fade-in 0.2s ease-out',
            },
            keyframes: {
                glow: {
                    '0%': { boxShadow: '0 0 5px #00f3ff, 0 0 10px #00f3ff' },
                    '100%': { boxShadow: '0 0 20px #00f3ff, 0 0 30px #00f3ff' },
                },
                'glow-purple': {
                    '0%': { boxShadow: '0 0 5px #bc13fe, 0 0 10px #bc13fe' },
                    '100%': { boxShadow: '0 0 20px #bc13fe, 0 0 30px #bc13fe' },
                },
                'slide-up': {
                    '0%': { transform: 'translateY(10px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                'fade-in': {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
            },
        },
    },
    plugins: [],
}
