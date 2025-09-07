import * as Print from "expo-print";
import React, { useState } from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import QRCodeScanner from "react-native-qrcode-scanner";

export default function App() {
    const [scannedData, setScannedData] = useState(null);
    const [scanned, setScanned] = useState(false);

    const onSuccess = (e) => {
        setScannedData(e.data);
        setScanned(true);
        printData(e.data);
    };

    const printData = async (data) => {
        try {
            await Print.printAsync({
                html: `<h1 style="text-align:center;">QR Code Data</h1><p>${data}</p>`,
            });
        } catch (error) {
            console.error("Printing error:", error);
        }
    };

    return (
        <View style={{ flex: 1 }}>
            {!scanned ? (
                <QRCodeScanner onRead={onSuccess} />
            ) : (
                <View style={styles.resultContainer}>
                    <Text>Scanned Data: {scannedData}</Text>
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
    },
});
