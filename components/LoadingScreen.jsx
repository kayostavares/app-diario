import React from 'react';
import { ActivityIndicator, Text, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from '../styles/styles';

const LoadingScreen = () => (
  <SafeAreaView style={styles.safeAreaCentered}>
    <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
    <ActivityIndicator size="large" color="#2f6fed" />
    <Text style={styles.infoText}>Verificando identidade...</Text>
  </SafeAreaView>
);

export default LoadingScreen;