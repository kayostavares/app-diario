import React, { useState, useEffect } from 'react';
import { Alert } from 'react-native';

import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import ForgotPasswordScreen from './screens/ForgotPasswordScreen';
import DiarioScreen from './screens/DiarioScreen';
import LoadingScreen from './components/LoadingScreen';

import { authenticateUser } from './services/authService';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('LOGIN'); // LOGIN | REGISTER | FORGOT | DIARIO
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const handleLogin = async (credentials) => {
    setIsAuthenticating(true);
    // Tenta autenticação biométrica local
    const authenticated = await authenticateUser();
    setIsAuthenticating(false);

    if (authenticated) {
      setCurrentScreen('DIARIO');
    } else {
      Alert.alert('Autenticação falhou', 'Não foi possível confirmar a biometria/senha.');
    }
  };

  const handleRegister = (newUser) => {
    Alert.alert('Sucesso', 'Conta criada com sucesso!');
    setCurrentScreen('LOGIN');
  };

  const handleForgotPassword = (email) => {
    Alert.alert('Sucesso', `Instruções enviadas para ${email}`);
    setCurrentScreen('LOGIN');
  };

  if (isAuthenticating) {
    return <LoadingScreen />;
  }

  switch (currentScreen) {
    case 'REGISTER':
      return (
        <RegisterScreen
          onRegister={handleRegister}
          onBack={() => setCurrentScreen('LOGIN')}
        />
      );

    case 'FORGOT':
      return (
        <ForgotPasswordScreen
          onSendReset={handleForgotPassword}
          onBack={() => setCurrentScreen('LOGIN')}
        />
      );

    case 'DIARIO':
      return (
        <DiarioScreen
          onLogout={() => setCurrentScreen('LOGIN')}
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
}