import React from 'react';
import { Alert } from 'react-native';
import { render, fireEvent, screen, cleanup } from '@testing-library/react-native';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import EntryCard from '../components/EntryCard';

jest.mock('@expo/vector-icons', () => ({
  Ionicons: 'Ionicons',
}));

jest.mock('react-native-safe-area-context', () => ({
  SafeAreaView: ({ children }) => children,
}));

jest.mock('../styles/theme', () => ({
  useTheme: () => ({
    theme: {
      background: '#fff',
      cardBg: '#fff',
      text: '#000',
      textSecondary: '#666',
      border: '#ccc',
      inputBg: '#f9f9f9',
      primary: '#2f6fed',
      chipBg: '#eee',
      dangerText: '#f00',
      statusBar: 'dark-content',
    },
    isDark: false,
    toggleTheme: jest.fn(),
  }),
}));

describe('Testes de Interface (Telas e Componentes)', () => {
  beforeEach(() => {
    jest.spyOn(Alert, 'alert').mockImplementation(() => {});
  });

  afterEach(async () => {
    await cleanup();
    jest.restoreAllMocks();
  });

  test('LoginScreen: deve exibir alerta se tentar entrar sem preencher e-mail e senha', async () => {
    const mockOnLogin = jest.fn();
    await render(
      <LoginScreen onLogin={mockOnLogin} onRegister={jest.fn()} onForgotPassword={jest.fn()} />
    );

    await fireEvent.press(screen.getByText('Entrar'));

    expect(Alert.alert).toHaveBeenCalledWith('Atenção', 'Preencha e-mail e senha.');
    expect(mockOnLogin).not.toHaveBeenCalled();
  });

  test('LoginScreen: deve chamar onLogin com e-mail e senha preenchidos', async () => {
    const mockOnLogin = jest.fn();
    await render(
      <LoginScreen onLogin={mockOnLogin} onRegister={jest.fn()} onForgotPassword={jest.fn()} />
    );

    await fireEvent.changeText(screen.getByPlaceholderText('seuemail@exemplo.com'), 'teste@campo.com');
    await fireEvent.changeText(screen.getByPlaceholderText('Sua senha'), '123456');
    await fireEvent.press(screen.getByText('Entrar'));

    expect(mockOnLogin).toHaveBeenCalledWith({
      email: 'teste@campo.com',
      password: '123456',
    });
  });

  test('RegisterScreen: deve bloquear cadastro quando as senhas não coincidem', async () => {
    const mockOnRegister = jest.fn();
    await render(
      <RegisterScreen onRegister={mockOnRegister} onBack={jest.fn()} />
    );

    await fireEvent.changeText(screen.getByPlaceholderText('Ex: João da Silva'), 'Maria');
    await fireEvent.changeText(screen.getByPlaceholderText('Ex: joao@campo.com'), 'maria@campo.com');
    await fireEvent.changeText(screen.getByPlaceholderText('Mínimo 6 caracteres'), '123456');
    await fireEvent.changeText(screen.getByPlaceholderText('Repita sua senha'), '654321');
    await fireEvent.press(screen.getByText('Cadastrar'));

    expect(Alert.alert).toHaveBeenCalledWith('Atenção', 'As senhas não coincidem.');
    expect(mockOnRegister).not.toHaveBeenCalled();
  });

  test('EntryCard: deve renderizar título, nome da pasta e localização corretamente', async () => {
    const sampleItem = {
      id: '101',
      title: 'Medição de Solo',
      done: false,
      coords: { latitude: -23.5, longitude: -46.6, address: 'Fazenda Boa Vista' },
      createdAt: new Date().toISOString(),
    };

    await render(
      <EntryCard
        item={sampleItem}
        folderName="Projeto Agro"
        onToggle={jest.fn()}
        onEdit={jest.fn()}
        onRemove={jest.fn()}
        onOpenMap={jest.fn()}
        onPreviewPhoto={jest.fn()}
      />
    );

    expect(screen.getByText('Medição de Solo')).toBeTruthy();
    expect(screen.getByText('Projeto Agro')).toBeTruthy();
    expect(screen.getByText('Fazenda Boa Vista')).toBeTruthy();
  });
});