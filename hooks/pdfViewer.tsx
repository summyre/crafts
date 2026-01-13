// Source - https://stackoverflow.com/questions/79139192/how-can-i-display-a-pdf-in-an-expo-go-project
// Posted by Simran Singh, modified by community. See post 'Timeline' for change history
// Retrieved 2026-01-07, License - CC BY-SA 4.0

import { useEffect, useState } from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import { Asset } from 'expo-asset';
import { WebView } from 'react-native-webview';

type PDFViewerProps = {
    source: string | number;
};

export default function PDFViewer({source}: PDFViewerProps) {
    const [pdfUri, setPdfUri] = useState<string | null>(null);

    useEffect(() => {
        const loadPdf = async () => {
            if (typeof source === 'number') {
                const asset = Asset.fromModule(source);
                await asset.downloadAsync();
                setPdfUri(asset.localUri || asset.uri);
            } else {
                setPdfUri(source);
            }
        };

        loadPdf().catch(console.error);
    }, [source]);

    if (!pdfUri) {
        return (
            <View style={styles.loader}>
                <ActivityIndicator size='large' color='#0000ff'/>
            </View>
        );
    }

    return (
        <WebView
            source={{uri: pdfUri}}
            style={styles.webView}
            onError={(error) => console.error('PDF error:', error)}/>
    );
};

const styles = StyleSheet.create({
    loader: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    webView: {
        flex: 1,
        width: '100%'
    }
});