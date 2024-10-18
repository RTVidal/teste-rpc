# Seja bem-vindo ao aplicativo "Video&Video", desenvolvido como projeto para o teste técnico para o cargo de Analista de Sistemas Mobile Pleno na RPC 👋

Projeto [Expo](https://expo.dev) criado com [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).


## Instalar e executar o aplicativo

Após o downlod do repositório, executar os seguintes comandos para rodar o projeto localmente em um emulador ou dispositivo android conectado

Opção 1: Gerar build localmente

1. Instalar dependências

   ```bash
   npm install
   ```

2. Gerar um build local

   ```bash
   npx expo run:android
   ```

3. Iniciar o aplicativo e o servidor de desenvolvimento

   ```bash
    npx expo start
   ```

4. Seguir as instruções do prompt para atualizar o aplicativo no dispositivo

Opção 2: Gerar build via **eas**

1. Instalar dependências

   ```bash
   npm install
   ```

2. Gerar um build

   ```bash
   eas build --platform android --profile development
   ```

3. Iniciar o aplicativo e o servidor de desenvolvimento

   ```bash
    npx expo start
   ```

4. Seguir as instruções do prompt para atualizar o aplicativo no dispositivo

Opção 3: Instalar diretamente a apk gerada via **eas build** e disponibilizada no ambiente **expo.dev**

Disponível em [https://expo.dev/accounts/rafaelvidal/projects/teste-rpc/builds/20fc2e3a-3370-4507-91f1-a775aeee9872](https://expo.dev/accounts/rafaelvidal/projects/teste-rpc/builds/20fc2e3a-3370-4507-91f1-a775aeee9872)

## Observações gerais

Devido à limitações de dispositivos paradesenvolvimento e testes, o projeto foi desenvolvido com foco em ambiente Android

O aplicativo possui um módulo interno simulando uma api, dispensando conexão com a internet.

Para fins de otimização, os posts de usuários fictícios exibem o mesmo asset de vídeo. Entretando, cada post é único dentro do cenário do aplicativo.

Em caso de dúvidas, é possível entrar em contato através do email **rafaelvidal4@gmail.com**.
