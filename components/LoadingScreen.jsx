import React from 'react';
import { ActivityIndicator, Text, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../styles/theme';
import styles from '../styles/styles';

const LoadingScreen = () => {
  const { theme } = useTheme();

  return (
    <SafeAreaView style={[styles.safeAreaCentered, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={theme.statusBar} backgroundColor={theme.background} />
      <ActivityIndicator size="large" color={theme.primary} />
      <Text style={[styles.infoText, { color: theme.textSecondary }]}>
        Verificando identidade...
      </Text>
    </SafeAreaView>
  );
};

export default LoadingScreen;