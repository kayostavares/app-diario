# Diário de Campo Mobile

Registro georreferenciado e fotográfico de anotações em campo com autenticação biométrica e persistência local offline.

O sistema separa responsabilidades entre interface, serviços de hardware e armazenamento: as telas gerenciam o ciclo de vida da UI; os módulos de serviço encapsulam o acesso a sensores nativos (câmera, GPS e biometria) com tratamento estrito de permissões; a camada utilitária manipula as regras de dados de forma pura; e a persistência opera de maneira desacoplada via armazenamento assíncrono local (AsyncStorage).

## Pipeline

1. Autenticação e controle de acesso — validação por biometria ou credenciais nativas do dispositivo
2. Coleta de dados e sensoriamento — captura de texto, imagem (câmera ou galeria) e coordenadas GPS
3. Geocodificação reversa — resolução determinística das coordenadas geográficas para endereço legível
4. Persistência local — serialização e armazenamento dos registros em banco chave-valor offline
5. Consulta e gestão — renderização em lista otimizada com busca dinâmica, filtros por estado e link externo para mapas

## Stack

| Camada | Tecnologia |
| --- | --- |
| Interface (UI) | React Native + Expo |
| Sensoriamento (Hardware) | expo-camera, expo-image-picker, expo-location |
| Segurança / Acesso | expo-local-authentication |
| Persistência Local | @react-native-async-storage/async-storage |
| Ícones e Identidade | @expo/vector-icons (Ionicons) |

## Estrutura

```text
components/       Componentes modulares de interface (cards, modal e formulário)
screens/          Telas da aplicação e fluxos de navegação
services/         Encapsulamento de APIs nativas (câmera, localização, biometria e storage)
styles/           Design system e folhas de estilo centralizadas
utils/            Regras puras de transformação, ordenação e manipulação de registros

Executando localmente
Pré-requisitos

    Node.js (versão 18 ou superior)

    Aplicativo Expo Go instalado no dispositivo físico (Android ou iOS)

Passos
code Bash

# Clone o repositório
git clone <URL_DO_REPOSITORIO>
cd app-diario

# Instale as dependências
npm install

# Inicie o servidor Metro Bundler
npx expo start

Escaneie o QR Code exibido no terminal utilizando o aplicativo Expo Go para abrir a aplicação no dispositivo.
Contexto acadêmico

Projeto desenvolvido para a matéria de Laboratório de Desenvolvimento de Aplicativos Híbridos.
Licença

MIT — ver LICENSE.
