// Define uma interface base para todos os nós da AST
export interface ASTNode {
    id: number; // Identificador único para o nó
    type: string; // Tipo do nó, usado para identificação
  }
  
  // Classe utilitária para gerar IDs únicos
  export class ASTNodeCounter {
    private static currentId = 0;
    public static getNextId(): number {
      return ++this.currentId;
    }
  }
  
  // Representa um número na AST (ex.: 42)
  export class NumberNode implements ASTNode {
    id: number;
    constructor(public value: string) {
      this.id = ASTNodeCounter.getNextId();
    }
    type = "Number";
  }
  
  // Representa um nome ou variável na AST (ex.: x)
  export class NameNode implements ASTNode {
    id: number;
    constructor(public value: string) {
      this.id = ASTNodeCounter.getNextId();
    }
    type = "Name";
  }
  
  // Representa uma atribuição de valor a uma variável (ex.: x = 5)
  export class AssignmentNode implements ASTNode {
    id: number;
    constructor(public name: NameNode, public value: ASTNode) {
      this.id = ASTNodeCounter.getNextId();
    }
    type = "Assignment";
  }
  
  // Representa uma operação binária (ex.: 4 + 5)
  export class BinaryOpNode implements ASTNode {
    id: number;
    constructor(
      public left: ASTNode,
      public operator: string,
      public right: ASTNode
    ) {
      this.id = ASTNodeCounter.getNextId();
    }
    type = "BinaryOp";
  }
  
  // Representa uma expressão condicional (ex.: x < 10)
  export class ConditionalNode implements ASTNode {
    id: number;
    constructor(
      public left: ASTNode,
      public operator: string,
      public right: ASTNode
    ) {
      this.id = ASTNodeCounter.getNextId();
    }
    type = "Conditional";
  }
  
  // Representa uma estrutura condicional if (ex.: if x < 10 then ...)
  export class IfNode implements ASTNode {
    id: number;
    constructor(
      public condition: ASTNode,
      public thenBranch: ASTNode,
      public elseBranch: ASTNode | null = null
    ) {
      this.id = ASTNodeCounter.getNextId();
    }
    type = "If";
  }
  