import React from "react";
import { StyleSheet, Dimensions } from "react-native";
import Pdf from 'react-native-pdf';

type PDFViewerProps = {
    uri: string;
};

export default function PDFViewer({uri}: PDFViewerProps) {
    const source = {uri};

    return (
        <Pdf
            source={source}
            style={styles.pdf}
            onError={(error) => console.error('PDF Error: ', error)}
            onLoadComplete={(numberOfPages) => console.log(`Loaded PDF with ${numberOfPages} pages`)}
            onPageChanged={(page, numberOfPages) => console.log(`Current page: ${page} / ${numberOfPages}`)}
        />
    );
};

const styles = StyleSheet.create({
    pdf: {
        flex: 1,
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height
    }
});