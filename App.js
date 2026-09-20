import React, { useState } from 'react';
import { Alert } from 'react-native';

import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import ForgotPasswordScreen from './screens/ForgotPasswordScreen';
import DiarioScreen from './screens/DiarioScreen';
import ProfileScreen from './screens/ProfileScreen';
import LoadingScreen from './components/LoadingScreen';

import { authenticateUser } from './services/authService';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('LOGIN'); // LOGIN | REGISTER | FORGOT | DIARIO | PROFILE
  const [isAuthenticating, setIsAuthenticating] = useState(false);

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

  if (isAuthenticating) {
    return <LoadingScreen />;
  }

  switch (currentScreen) {
    case 'REGISTER':
      return (
        <RegisterScreen
          onRegister={() => setCurrentScreen('LOGIN')}
          onBack={() => setCurrentScreen('LOGIN')}
        />
      );

    case 'FORGOT':
      return (
        <ForgotPasswordScreen
          onSendReset={() => setCurrentScreen('LOGIN')}
          onBack={() => setCurrentScreen('LOGIN')}
        />
      );

    case 'PROFILE':
      return <ProfileScreen onBack={() => setCurrentScreen('DIARIO')} />;

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
}