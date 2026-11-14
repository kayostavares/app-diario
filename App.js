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
import {
  authenticateUser,
  loginWithFirebase,
  registerWithFirebase,
  resetPasswordWithFirebase,
  logoutWithFirebase
} from './services/authService';
import { auth } from './services/firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';

function MainNavigator() {
  const { theme } = useTheme();
  const [currentScreen, setCurrentScreen] = useState('LOGIN');
  const [isAuthenticating, setIsAuthenticating] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const biometricOk = await authenticateUser();
        if (biometricOk) {
          setCurrentScreen('DIARIO');
        } else {
          setCurrentScreen('LOGIN');
        }
      } else {
        setCurrentScreen('LOGIN');
      }
      setIsAuthenticating(false);
    });
    return unsubscribe;
  }, []);

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
              onPress: handleLogout,
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

  const handleLogin = async ({ email, password }) => {
    setIsAuthenticating(true);
    try {
      await loginWithFirebase(email, password);
    } catch (error) {
      let msg = 'Erro ao realizar login.';
      if (
        error.code === 'auth/invalid-credential' ||
        error.code === 'auth/user-not-found' ||
        error.code === 'auth/wrong-password'
      ) {
        msg = 'E-mail ou senha incorretos.';
      } else if (error.code === 'auth/invalid-email') {
        msg = 'Formato de e-mail inválido.';
      }
      Alert.alert('Falha no Login', msg);
      setIsAuthenticating(false);
    }
  };

  const handleRegister = async ({ name, email, password }) => {
    setIsAuthenticating(true);
    try {
      await registerWithFirebase(email, password, name);
      Alert.alert('Conta Criada!', 'Seu cadastro foi realizado com sucesso.');
    } catch (error) {
      let msg = 'Não foi possível cadastrar.';
      if (error.code === 'auth/email-already-in-use') {
        msg = 'Este e-mail já está sendo utilizado.';
      } else if (error.code === 'auth/weak-password') {
        msg = 'A senha deve possuir pelo menos 6 caracteres.';
      }
      Alert.alert('Erro no Cadastro', msg);
      setIsAuthenticating(false);
    }
  };

  const handleForgotPassword = async (email) => {
    try {
      await resetPasswordWithFirebase(email);
      Alert.alert('E-mail Enviado', `Instruções de recuperação foram enviadas para ${email}`);
      setCurrentScreen('LOGIN');
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível enviar o e-mail de recuperação.');
    }
  };

  const handleLogout = async () => {
    try {
      await logoutWithFirebase();
      setCurrentScreen('LOGIN');
    } catch (error) {
      Alert.alert('Erro', 'Falha ao encerrar a sessão.');
    }
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
                  onRegister={handleRegister}
                  onBack={() => setCurrentScreen('LOGIN')}
                />
              </SwipeBackView>
            );

          case 'FORGOT':
            return (
              <SwipeBackView onBack={() => setCurrentScreen('LOGIN')}>
                <ForgotPasswordScreen
                  onSendReset={handleForgotPassword}
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
                onLogout={handleLogout}
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