import { Lexer, TokenType } from "./lexer";
import { Parser } from "./parser";
import { ExecutionContext, executeAST } from "./execution";
import {
  BinaryOpNode,
  NumberNode,
  IfNode,
  ASTNode, // Certifique-se de que ASTNode está sendo importado.
} from "./ast-node";

// Função para converter um nó da AST em JSON
export function astNodeToJson(node: ASTNode | null): any {
  if (!node) return null;

  if (node instanceof BinaryOpNode) {
    return {
      type: "BinaryOpNode",
      operator: node.operator,
      left: astNodeToJson(node.left),
      right: astNodeToJson(node.right),
    };
  }

  if (node instanceof NumberNode) {
    return {
      type: "NumberNode",
      value: node.value,
    };
  }

  if (node instanceof IfNode) {
    return {
      type: "IfNode",
      condition: astNodeToJson(node.condition),
      thenBranch: astNodeToJson(node.thenBranch),
      elseBranch: astNodeToJson(node.elseBranch),
    };
  }

  // Caso existam outros tipos de nós, eles devem ser tratados aqui
  return {
    type: "UnknownNode",
    details: node,
  };
}

// Função para interpretar o conteúdo do programa e gerar a AST em JSON
export function interpretProgram(input: string): { astJson: string, variables: { [key: string]: any } } {
  try {
    const context = new ExecutionContext();
    const lexer = new Lexer(input);
    const parser = new Parser(lexer);

    const astNodes: any[] = [];
    while (lexer.lookAhead().type !== TokenType.EOF) {
      const astNode = parser.parse();
      astNodes.push(astNodeToJson(astNode)); // Uso da função corrigida
      executeAST(astNode, context);
    }

    // Exibir o JSON da AST
    const astJson = JSON.stringify(astNodes, null, 2);

    // Obter o resultado final das variáveis armazenadas no contexto
    const variables = context['variables'];

    // Retornar tanto a AST em JSON quanto as variáveis interpretadas
    return { astJson, variables };
  } catch (error) {
    console.error("Erro durante a execução:");
    console.error(error);
    return { astJson: '', variables: {} }; // Retorna valores vazios em caso de erro
  }
}
