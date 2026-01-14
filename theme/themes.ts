export type Theme = {
    mode: string;
    colors: {
        background: string;
        card: string;
        text: string;
        primary: string;
        border: string;
        secondary: string;
        milestone: string;
        delete: string;
    };
};

export const themes: Record<string, Theme> = {
    light: {
        mode: "light",
        colors: {
            background: '#f5f5f5',
            card: '#ffffff',
            text: '#333333',
            primary: '#4a6572',
            border: '#e0e0e0',
            secondary: '#4a6572',
            milestone: '#4a6572',
            delete: '#ff0000'
        }
    },
    dark: {
        mode: "dark",
        colors: {
            background: '#121212',
            card: '#1e1e1e',
            text: '#ffffff',
            primary: '#f9aa33',
            border: '#333333',
            secondary: '#4a6572',
            milestone: '#4a6572',
            delete: '#ff0000'
        }
    },
    pastel: {
        mode: "pastel",
        colors: {
            background: '#f9f9f9',
            card: '#ffffff',
            text: '#5c4b51',
            primary: '#d4a5a5',
            border: '#e8cfcf',
            secondary: '#b39898',
            milestone: '#4a6572',
            delete: '#ff0000'
        }
    },
    nature: {
        mode: "nature",
        colors: {
            background: '#e8f5e9',
            card: '#ffffff',
            text: '#2e7d32',
            primary: '#4caf50',
            border: '#c8e6c9',
            secondary: '#375b38',
            milestone: '#f2c657',
            delete: '#910f0f'
        }
    }
};