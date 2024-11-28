export enum TokenType {
  Variavel,         // Variável
  Constante,        // Constante
  Funcao,           // Função
  Numero,           // Número
  Identificador,    // Identificador
  OperadorBinario,  // Operador Binário
  Igual,            // Igual
  Virgula,          // Vírgula
  Ponto,            // Ponto
  DoisPontos,       // Dois Pontos
  PontoVirgula,    // Ponto e Vírgula
  AbreParenteses,   // Abre Parênteses
  FechaParenteses,  // Fecha Parênteses
  AbreChave,        // Abre Chave
  FechaChave,       // Fecha Chave
  AbreColchete,     // Abre Colchete
  FechaColchete,    // Fecha Colchete
  FimArquivo,       // Fim de Arquivo
}

/**
 * Constante para mapear palavras-chave e identificadores conhecidos + símbolos.
 */
const KEYWORDS: Record<string, TokenType> = {
  variavel: TokenType.Variavel,
  constante: TokenType.Constante,
  funcao: TokenType.Funcao,
};

// Representa um único token gerado a partir do código-fonte.
export interface Token {
  value: string; 
  type: TokenType; 
}

// Retorna um token de um dado tipo e valor
function token(value = "", type: TokenType): Token {
  return { value, type };
}

/**
 * Retorna se o caractere passado é alfabético (letras e acentos inclusos).
 */
function isalpha(src: string) {
  return /^[a-zA-ZáéíóúãõâêôçÁÉÍÓÚÃÕÂÊÔÇ]+$/.test(src);
}

/**
 * Retorna true se o caractere é um espaço em branco.
 */
function isskippable(str: string) {
  return str == " " || str == "\n" || str == "\t" || str == "\r";
}

/**
 * Retorna se o caractere é um número inteiro válido.
 */
function isint(str: string) {
  const c = str.charCodeAt(0);
  return c >= "0".charCodeAt(0) && c <= "9".charCodeAt(0);
}

/**
 * Dado uma string representando o código-fonte, produz tokens.
 */
export function tokenize(sourceCode: string): Token[] {
  const tokens = new Array<Token>();
  const src = sourceCode.split("");

  while (src.length > 0) {
    if (src[0] == "(") {
      tokens.push(token(src.shift()!, TokenType.AbreParenteses));
    } else if (src[0] == ")") {
      tokens.push(token(src.shift()!, TokenType.FechaParenteses));
    } else if (src[0] == "{") {
      tokens.push(token(src.shift()!, TokenType.AbreChave));
    } else if (src[0] == "}") {
      tokens.push(token(src.shift()!, TokenType.FechaChave));
    } else if (src[0] == "[") {
      tokens.push(token(src.shift()!, TokenType.AbreColchete));
    } else if (src[0] == "]") {
      tokens.push(token(src.shift()!, TokenType.FechaColchete));
    } else if ("+-*/%".includes(src[0])) {
      tokens.push(token(src.shift()!, TokenType.OperadorBinario));
    } else if (src[0] == "=") {
      tokens.push(token(src.shift()!, TokenType.Igual));
    } else if (src[0] == ";") {
      tokens.push(token(src.shift()!, TokenType.PontoVirgula));
    } else if (src[0] == ":") {
      tokens.push(token(src.shift()!, TokenType.DoisPontos));
    } else if (src[0] == ",") {
      tokens.push(token(src.shift()!, TokenType.Virgula));
    } else if (src[0] == ".") {
      tokens.push(token(src.shift()!, TokenType.Ponto));
    } else if (isint(src[0])) {
      let num = "";
      while (src.length > 0 && isint(src[0])) {
        num += src.shift();
      }
      tokens.push(token(num, TokenType.Numero));
    } else if (isalpha(src[0])) {
      let ident = "";
      while (src.length > 0 && isalpha(src[0])) {
        ident += src.shift();
      }
      const reserved = KEYWORDS[ident];
      if (typeof reserved == "number") {
        tokens.push(token(ident, reserved));
      } else {
        tokens.push(token(ident, TokenType.Identificador));
      }
    } else if (isskippable(src[0])) {
      src.shift();
    } else {
      console.error(
        "Caractere não reconhecido: ",
        src[0].charCodeAt(0),
        src[0]
      );
      src.shift();
    }
  }

  tokens.push({ type: TokenType.FimArquivo, value: "FimDoArquivo" });
  return tokens;
}
