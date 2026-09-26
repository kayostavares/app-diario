import React, { useState, useEffect } from 'react';
import { View, Alert, BackHandler } from 'react-native';

import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import ForgotPasswordScreen from './screens/ForgotPasswordScreen';
import DiarioScreen from './screens/DiarioScreen';
import ProfileScreen from './screens/ProfileScreen';
import LoadingScreen from './components/LoadingScreen';
import SwipeBackView from './components/SwipeBackView';

import { ThemeProvider, useTheme } from './styles/theme';
import { authenticateUser } from './services/authService';

function MainNavigator() {
  const { theme } = useTheme();
  const [currentScreen, setCurrentScreen] = useState('LOGIN');
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  useEffect(() => {
    const handleBackButton = () => {
      if (currentScreen === 'REGISTER' || currentScreen === 'FORGOT') {
        setCurrentScreen('LOGIN');
        return true;
      }

      if (currentScreen === 'PROFILE') {
        setCurrentScreen('DIARIO');
        return true;
      }

      if (currentScreen === 'DIARIO') {
        Alert.alert(
          'Sair do Diário',
          'Deseja realmente encerrar a sessão e sair da sua conta?',
          [
            { text: 'Cancelar', style: 'cancel' },
            {
              text: 'Sair',
              style: 'destructive',
              onPress: () => setCurrentScreen('LOGIN'),
            },
          ]
        );
        return true;
      }

      return false;
    };

    const backHandlerSubscription = BackHandler.addEventListener(
      'hardwareBackPress',
      handleBackButton
    );

    return () => backHandlerSubscription.remove();
  }, [currentScreen]);

  const handleLogin = async () => {
    setIsAuthenticating(true);
    const authenticated = await authenticateUser();
    setIsAuthenticating(false);

    if (authenticated) {
      setCurrentScreen('DIARIO');
    } else {
      Alert.alert('Autenticação falhou', 'Confirmação biométrica ou PIN não concedida.');
    }
  };

  const handleRegisterSuccess = () => {
    Alert.alert(
      'Conta Criada!',
      'Seu cadastro foi realizado com sucesso. Faça login para acessar seu diário de campo.',
      [
        {
          text: 'Fazer Login',
          onPress: () => setCurrentScreen('LOGIN'),
        },
      ]
    );
  };

  const handleForgotPasswordSuccess = (email) => {
    Alert.alert('Recuperação Enviada', `Instruções enviadas para ${email}`);
    setCurrentScreen('LOGIN');
  };

  if (isAuthenticating) {
    return <LoadingScreen />;
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      {(() => {
        switch (currentScreen) {
          case 'REGISTER':
            return (
              <SwipeBackView onBack={() => setCurrentScreen('LOGIN')}>
                <RegisterScreen
                  onRegister={handleRegisterSuccess}
                  onBack={() => setCurrentScreen('LOGIN')}
                />
              </SwipeBackView>
            );

          case 'FORGOT':
            return (
              <SwipeBackView onBack={() => setCurrentScreen('LOGIN')}>
                <ForgotPasswordScreen
                  onSendReset={handleForgotPasswordSuccess}
                  onBack={() => setCurrentScreen('LOGIN')}
                />
              </SwipeBackView>
            );

          case 'PROFILE':
            return (
              <SwipeBackView onBack={() => setCurrentScreen('DIARIO')}>
                <ProfileScreen onBack={() => setCurrentScreen('DIARIO')} />
              </SwipeBackView>
            );

          case 'DIARIO':
            return (
              <DiarioScreen
                onLogout={() => setCurrentScreen('LOGIN')}
                onOpenProfile={() => setCurrentScreen('PROFILE')}
              />
            );

          case 'LOGIN':
          default:
            return (
              <LoginScreen
                onLogin={handleLogin}
                onRegister={() => setCurrentScreen('REGISTER')}
                onForgotPassword={() => setCurrentScreen('FORGOT')}
              />
            );
        }
      })()}
    </View>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <MainNavigator />
    </ThemeProvider>
  );
}