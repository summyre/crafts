import React, { useRef, useState } from "react";
import { View, Text, TextInput, FlatList, TouchableOpacity, Image, Alert, StyleSheet, Modal, Platform, ActivityIndicator } from "react-native";
import { Pattern } from "../store/types";
import { SketchCanvas } from '@terrylinla/react-native-sketch-canvas';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import { WebView } from 'react-native-webview';
import { useProjects } from "../store/ProjectsContext";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../App";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import PDFViewer from "../hooks/pdfViewerV2";

type RouteProps = RouteProp<RootStackParamList, 'PatternWishlist'>;
type NavProps = NativeStackNavigationProp<RootStackParamList>;

export default function PatternWishlistScreen() {
    const { projectId } = useRoute<RouteProps>().params;
    const navigation = useNavigation<NavProps>();
    const { projects, setProjects } = useProjects();
    const project = projects.find(p => p.id === projectId);
    const [title, setTitle] = useState('');
    const [notes, setNotes] = useState('');
    const [imageUri, setImageUri] = useState<string | undefined>();
    const [pdf, setPdf] = useState<Pattern['pdf']>();
    const [pdfModalVisible, setPdfModalVisible] = useState(false);
    const [pdfModalUri, setPdfModalUri] = useState<string | null>(null);

    if (!project) {
        return (
            <View style={styles.container}>
                <Text>Project not found</Text>
            </View>
        );
    }

    const wishlist: Pattern[] = project.patternWishlist || [];

    const deletePattern = (patternId: string) => {
        Alert.alert('Delete pattern?', 'This cannot be undone',
            [
                {text: 'Cancel', style: 'cancel'},
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: () => {
                        setProjects(prev => prev.map(p =>
                            p.id === projectId ? {
                                ...p,
                                patternWishlist: p.patternWishlist?.filter(
                                    pat => pat.id !== patternId
                                )
                            } : p
                        ));
                    }
                }
            ]
        )
    };

    const addPattern = async () => {
        if (!title.trim()) {
            Alert.alert('Error', 'Please enter a title for the pattern');
            return;
        }

        const newPattern: Pattern = {
            id: Date.now().toString(),
            title,
            notes,
            imageUri,
            pdf
        };

        setProjects(prev => prev.map(p => 
            p.id === projectId ? {
                ...p, 
                patternWishlist: [...(p.patternWishlist ?? []), newPattern]
            } : p
        ));

        setTitle('');
        setNotes('');
        setImageUri(undefined);
        setPdf(undefined);
    };

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({quality: 0.7});
        if (result.canceled) return;
        setImageUri(result.assets[0].uri);
    };

    const pickPdf = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: 'application/pdf',
                copyToCacheDirectory: true
            });

            if (result.canceled) return;
            const asset = result.assets[0]
            console.log('picked pdf:', asset.uri, asset.name);

            let pdfUri = asset.uri;

            if (Platform.OS === 'android') {
                if (!pdfUri.startsWith('content://') && !pdfUri.startsWith('file://')) {
                    pdfUri = 'file://' + pdfUri;
                }
            } else if (Platform.OS === 'ios') {
                if (pdfUri.startsWith('/') && !pdfUri.startsWith('file://')) {
                    pdfUri = 'file://' + pdfUri;
                }
            }
            
            const pickedPdf = {
                uri: pdfUri,
                name: asset.name,
                addedAt: Date.now(),
                size: asset.size,
                mimeType: asset.mimeType
            };
            const copiedUri = `${FileSystem.Directory.pickDirectoryAsync}${pickedPdf.name}`;
            await FileSystem.File.pickFileAsync();
            setPdf({ ...pickedPdf, uri: copiedUri });

        } catch (error) {
            console.error('Error picking PDF:', error);
            Alert.alert('Error', 'Failed to pick PDF file');
        }
    };

    {/*const pickPdf = async () => {
        const result = await DocumentPicker.getDocumentAsync({
            type: 'application/pdf'
        });

        if (result.canceled) return;

        const asset = result.assets[0];
        setPdf({
            uri: asset.uri,
            name: asset.name,
            addedAt: Date.now()
        });

        openPDFModal(asset.uri);
    }*/}

    const openPDFModal = async (pdfUri: string) => {
        setPdfModalUri(pdfUri);
        setPdfModalVisible(true);
    }
    
    const renderWishlist = (item: Pattern) => {
        return (
            <View style={styles.card}>
                <TouchableOpacity onPress={() => navigation.navigate('PatternEdit', {projectId, patternId: item.id})}>
                    {item.imageUri ? (
                        <Image source={{uri: item.imageUri}} style={styles.image}/>
                    ) : (
                        <View style={styles.placeholder}>
                            <Text>No image</Text>
                        </View>
                    )}
                    <Text style={styles.patternTitle}>{item.title}</Text>
                    {item.notes ? (
                        <Text style={styles.notes}>{item.notes}</Text>
                    ): null}
                </TouchableOpacity>

                {item.pdf && (
                    <TouchableOpacity style={{marginTop: 8}} onPress={() => openPDFModal(item.pdf!.uri)}>
                        <Text style={styles.pdfText}>Open PDF ({item.pdf.name})</Text>
                    </TouchableOpacity>
                )}

                {!item.imageUri && item.pdf ? (
                    <View style={styles.placeholder}>
                        <Text>PDF attached</Text>
                    </View>
                ) : null}

                <TouchableOpacity onPress={() => deletePattern(item.id)}>
                    <Text style={styles.deleteText}>Delete</Text>
                </TouchableOpacity>
            </View>
        )
    }

    {/*const renderPattern = ({item}: {item: Pattern}) => {
        return (
            <TouchableOpacity style={styles.card}>
                {item.imageUri ? <Image source={{uri: item.imageUri}} style={styles.image}/> : <View style={styles.placeholder}><Text>No image</Text></View>}
                <Text style={styles.title}>{item.title}</Text>
                {item.notes ? <Text style={styles.notes}>{item.notes}</Text> : null}
            </TouchableOpacity>
        )
        
    };*/}

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Pattern</Text>

            <TextInput
                style={styles.input}
                placeholder="Pattern title"
                value={title}
                onChangeText={setTitle} />
            
            <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Notes (optional)"
                value={notes}
                onChangeText={setNotes}
                multiline />
            
            <TouchableOpacity style={styles.pickButton} onPress={pickImage}>
                <Text style={{color: '#fff'}}>{imageUri ? 'Change Image' : 'Pick Image'}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.pickButton} onPress={pickPdf}>
                <Text style={{color: '#fff'}}>{pdf ? 'Change PDF' : 'Attach PDF'}</Text>
            </TouchableOpacity>
            
            {imageUri && <Image source={{uri: imageUri}} style={styles.image} />}
            <TouchableOpacity style={styles.saveButton} onPress={addPattern}>
                <Text style={{color: '#fff', fontWeight: 'bold'}}>Add Pattern</Text>
            </TouchableOpacity>

            {pdf && (
                <Text style={styles.mutedText}>{pdf.name ?? 'PDF attached'}</Text>
            )}
            
            {wishlist.length === 0 ? (
                <Text style={styles.mutedText}>No patterns yet</Text>
            ) : (
                <FlatList
                    data={wishlist}
                    keyExtractor={item => item.id}
                    renderItem={({item}) => renderWishlist(item)}/>
            )}

            <Modal
                visible={pdfModalVisible}
                onRequestClose={() => setPdfModalVisible(false)}
                animationType='slide'>
                    <View style={{flex: 1}}>
                        <TouchableOpacity style={{padding: 12, backgroundColor: '#555'}} onPress={() => setPdfModalVisible(false)}>
                            <Text style={{color: '#fff'}}>Close PDF</Text>
                        </TouchableOpacity>
                        {pdfModalUri ? (
                            <WebView
                                source={{uri: pdfModalUri}}
                                style={{flex: 1}}
                                startInLoadingState
                                renderLoading={() => (
                                    <ActivityIndicator size='large' color='#0000ff' style={{flex: 1, justifyContent: 'center'}} />
                                )}
                            />
                        ) : null}
                    </View>
                    {/*{pdfModalUri && (
                        <PDFViewer uri={pdfModalUri} />
                    )}*/}
            </Modal>
        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16
    },
    card: {
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        padding: 12
    },
    title: {
        fontWeight: 'bold',
        marginTop: 8
    },
    patternTitle: {
        fontSize: 16,
        fontWeight: '600'
    },
    notes: {
        color: '#555',
        marginTop: 6
    },
    image: {
        width: '100%',
        height: 150,
        borderRadius: 8
    },
    placeholder: {
        width: '100%',
        height: 150,
        backgroundColor: '#eee',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center'
    },
    input: {
        borderWidth: 1, 
        borderColor: '#ccc',
        padding: 8,
        marginVertical: 8,
        borderRadius: 8
    },
    saveButton: {
        backgroundColor: 'green',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginVertical: 8
    },
    addButton: {
        backgroundColor: '#333',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 16
    },
    pickButton: {
        backgroundColor: '#555',
        padding: 12,
        borderRadius: 8,
        marginBottom: 8,
        alignItems: 'center'
    },
    deleteText: {
        color: 'red',
        marginTop: 8,
        fontWeight: 'bold'
    },
    mutedText: {
        fontStyle: 'italic',
        color: '#777'
    },
    textArea: {
        height: 80
    },
    pdfText: {
        color: '#2563eb',
        fontWeight: '600'
    }
})