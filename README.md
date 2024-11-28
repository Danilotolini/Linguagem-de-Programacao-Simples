# Simple Programming Language (SPL)  

## Sobre o Projeto  

O **Simple Programming Language (SPL)** é uma linguagem de programação didática, desenvolvida em **TypeScript** e executada no ambiente **Deno**. O objetivo é mostrar como os principais elementos de uma linguagem de programação — como análise léxica, análise sintática e interpretação — trabalham em conjunto para executar código.  

---  

## Como Executar o Projeto  

Para rodar o projeto, siga as etapas abaixo:  

1. Abra o arquivo `main.ts` no **Visual Studio Code**.  
2. Execute o seguinte comando no terminal:  

deno run --allow-all main.ts  

📚 Componentes do Projeto

### 🔹 Lexer (Analisador Léxico)  
Segmenta o código-fonte em **tokens**, que são pequenas unidades como palavras-chave, operadores e identificadores.  

### 🔹 AST (Árvore de Sintaxe Abstrata)  
Organiza o código em uma **estrutura hierárquica**, onde cada nó da árvore representa uma parte do programa, como expressões e declarações.  

### 🔹 Parser (Analisador Sintático)  
Recebe os tokens gerados pelo Lexer e monta a AST, garantindo que o código siga as regras sintáticas corretas da linguagem.  

### 🔹 Expressions (Expressões)  
Define operações, como cálculos e acessos a variáveis, que podem ser avaliadas para produzir um valor.  

### 🔹 Statements (Declarações)  
Instruções que controlam o fluxo do programa, como **loops**, **condicionais** e **declarações de variáveis**.  

### 🔹 Environment (Ambiente de Execução)  
Gerencia as variáveis e funções durante a execução, controlando os escopos e armazenando valores.  

### 🔹 Interpreter (Interpretador)  
Percorre a AST e executa cada instrução, processando as expressões conforme a lógica definida no código.  

### 🔹 Values (Tipos de Dados)  
Define os diferentes tipos de dados manipulados pela linguagem, como **números**, **strings** e **booleanos**.  

🛠️ Tecnologias Utilizadas

- **TypeScript**: Linguagem principal utilizada no desenvolvimento.  
- **Deno**: Ambiente de execução para TypeScript e JavaScript.  
- **Visual Studio Code**: Editor de código recomendado para trabalhar no projeto.
  
👥 Equipe de Desenvolvimento

| Nome                             | RA         |  
|----------------------------------|------------|  
| Victor Fogaça | 823216180  |  
| Danilo Tolini | 822135849  |  
| Luiz Guilherme Lorentz | 822164517  |  
| Tadeo Cáceres | 82215984   | 
