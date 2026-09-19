import React from 'react';
import { SafeAreaView, ActivityIndicator, Text } from 'react-native';
import styles from '../styles/styles';

const LoadingScreen = () => (
  <SafeAreaView style={styles.centered}>
    <ActivityIndicator size="large" color="#2f6fed" />
    <Text style={styles.infoText}>
      Verificando identidade...
    </Text>
  </SafeAreaView>
);

export default LoadingScreen;