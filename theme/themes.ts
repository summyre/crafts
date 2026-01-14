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
        textDark: string;
        link: string;
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
            secondary: '#6b8794',
            milestone: '#c9a227',
            delete: '#d32f2f',
            textDark: '#000000',
            link: '#2e8dc4'
        }
    },
    dark: {
        mode: "dark",
        colors: {
            background: '#1e1e2f',
            card: '#2a2a3d',
            text: '#000000',
            primary: '#7289da',
            border: '#3a3a4d',
            secondary: '#99a9f2',
            milestone: '#f4c430',
            delete: '#ef5350',
            textDark: '#ebe8e8',
            link: '#6bb4de'
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
            milestone: '#c9a227',
            delete: '#d32f2f',
            textDark: '#000000',
            link: '#1c6087'
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
            delete: '#910f0f',
            textDark: '#000000',
            link: '#44a3da'
        }
    }
};