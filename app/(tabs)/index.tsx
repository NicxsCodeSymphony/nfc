import { CameraView, useCameraPermissions } from 'expo-camera';
import * as Print from "expo-print";
import React, { useState } from "react";
import { Button, StyleSheet, Text, View } from "react-native";

export default function HomeScreen() {
    const [scannedData, setScannedData] = useState<string | null>(null);
    const [scanned, setScanned] = useState(false);
    const [permission, requestPermission] = useCameraPermissions();

    const handleBarCodeScanned = ({ type, data }: { type: string; data: string }) => {
        setScannedData(data);
        setScanned(true);
        printData(data);
    };

    const printData = async (data: string) => {
        try {
            await Print.printAsync({
                html: `<h1 style="text-align:center;"></h1><p>${data}</p>`,
            });
        } catch (error) {
            console.error("Printing error:", error);
        }
    };

    if (!permission) {
        // Camera permissions are still loading
        return <View style={styles.resultContainer}><Text>Loading camera permissions...</Text></View>;
    }

    if (!permission.granted) {
        // Camera permissions are not granted yet
        return (
            <View style={styles.resultContainer}>
                <Text style={{ textAlign: 'center', marginBottom: 20 }}>
                    We need your permission to show the camera
                </Text>
                <Button onPress={requestPermission} title="Grant Permission" />
            </View>
        );
    }

    return (
        <View style={{ flex: 1 }}>
            {!scanned ? (
                <CameraView
                    style={StyleSheet.absoluteFillObject}
                    facing="back"
                    onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
                    barcodeScannerSettings={{
                        barcodeTypes: ["qr", "pdf417"],
                    }}
                />
            ) : (
                <View style={styles.resultContainer}>
                    <Text style={{ fontSize: 18, marginBottom: 20, textAlign: 'center' }}>
                        Scanned Data:
                    </Text>
                    <Text style={{ fontSize: 16, marginBottom: 20, textAlign: 'center' }}>
                        {scannedData}
                    </Text>
                    <Button
                        title="Scan Again"
                        onPress={() => {
                            setScanned(false);
                            setScannedData(null);
                        }}
                    />
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    resultContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
});
