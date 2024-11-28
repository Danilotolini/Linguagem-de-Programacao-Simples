import {
  AssignmentExpr,
  BinaryExpr,
  CallExpr,
  Expr,
  Identifier,
  MemberExpr,
  NumericLiteral,
  ObjectLiteral,
  Program,
  Property,
  Stmt,
  VarDeclaration,
  FunctionDeclaration,
} from "./ast.ts";

import { Token, tokenize, TokenType } from "./lexer.ts";

export default class Parser {
  private tokens: Token[] = [];

  /*
   * Determina se a análise está completa e o FIM DE ARQUIVO está completo
   */
  private not_eof(): boolean {
    return this.tokens[0].type != TokenType.FimArquivo;
  }

  /**
   * Retorna o token atual disponível
   */
  private at() {
    return this.tokens[0] as Token;
  }

  /**
   * Retorna o token anterior e depois avança para o próximo valor do array tokens
   */
  private eat() {
    const prev = this.tokens.shift() as Token;
    return prev;
  }

  /**
   * Verifica o tipo do token esperado e lança uma exceção se o valor não combina
   */
  private expect(type: TokenType, err: any) {
    const prev = this.tokens.shift() as Token;
    if (!prev || prev.type != type) {
      console.error("Erro no Parser:\n", err, prev, " - Esperado: ", type);
      Deno.exit(1);
    }

    return prev;
  }

  public produceAST(sourceCode: string): Program {
    this.tokens = tokenize(sourceCode);
    const program: Program = {
      kind: "Program",
      body: [],
    };

    while (this.not_eof()) {
      program.body.push(this.parse_stmt());
    }

    return program;
  }

  private parse_stmt(): Stmt {
    switch (this.at().type) {
      case TokenType.Variavel:
      case TokenType.Constante:
        return this.parse_var_declaration();
      case TokenType.Funcao:
        return this.parse_fn_declaration();
      default:
        return this.parse_expr();
    }
  }

  parse_fn_declaration(): Stmt {
    this.eat();
    const name = this.expect(
      TokenType.Identificador,
      "Esperado o nome da função após a palavra-chave funcao"
    ).value;

    const args = this.parse_args();
    const params: string[] = [];
    for (const arg of args) {
      if (arg.kind !== "Identifier") {
        console.log(arg);
        throw "Dentro da declaração de função, esperados parâmetros do tipo string.";
      }

      params.push((arg as Identifier).symbol);
    }

    this.expect(
      TokenType.AbreChave,
      "Esperado o corpo da função após a declaração"
    );
    const body: Stmt[] = [];

    while (
      this.at().type !== TokenType.FimArquivo &&
      this.at().type !== TokenType.FechaChave
    ) {
      body.push(this.parse_stmt());
    }

    this.expect(
      TokenType.FechaChave,
      "Chave de fechamento esperada dentro da declaração da função"
    );

    const fn = {
      body,
      name,
      parameters: params,
      kind: "FunctionDeclaration",
    } as FunctionDeclaration;

    return fn;
  }

  parse_var_declaration(): Stmt {
    const isConstant = this.eat().type == TokenType.Constante;
    const identifier = this.expect(
      TokenType.Identificador,
      "Esperado nome do identificador após let | const."
    ).value;

    if (this.at().type == TokenType.PontoVirgula) {
      this.eat(); // espera o ponto e vírgula
      if (isConstant) {
        throw "Deve atribuir valor à expressão constante. Nenhum valor fornecido.";
      }

      return {
        kind: "VarDeclaration",
        identifier,
        constant: false,
      } as VarDeclaration;
    }

    this.expect(
      TokenType.Igual,
      "Esperado token de igual após o identificador na declaração de variável."
    );

    const declaration = {
      kind: "VarDeclaration",
      value: this.parse_expr(),
      identifier,
      constant: isConstant,
    } as VarDeclaration;

    this.expect(
      TokenType.PontoVirgula,
      "Declaração de variável deve terminar com ponto e vírgula."
    );

    return declaration;
  }

  private parse_expr(): Expr {
    return this.parse_assignment_expr();
  }

  private parse_assignment_expr(): Expr {
    const left = this.parse_object_expr();

    if (this.at().type == TokenType.Igual) {
      this.eat();
      const value = this.parse_assignment_expr();
      return { value, assigne: left, kind: "AssignmentExpr" } as AssignmentExpr;
    }

    return left;
  }

  private parse_object_expr(): Expr {
    if (this.at().type !== TokenType.AbreChave) {
      return this.parse_additive_expr();
    }

    this.eat();
    const properties = new Array<Property>();

    while (this.not_eof() && this.at().type != TokenType.FechaChave) {
      const key = this.expect(
        TokenType.Identificador,
        "Esperada chave de literal de objeto"
      ).value;

      if (this.at().type == TokenType.Virgula) {
        this.eat(); // avança pela vírgula
        properties.push({ key, kind: "Property" } as Property);
        continue;
      } else if (this.at().type == TokenType.FechaChave) {
        properties.push({ key, kind: "Property" });
        continue;
      }

      this.expect(
        TokenType.DoisPontos,
        "Faltando dois pontos após o identificador em ObjectExpr"
      );
      const value = this.parse_expr();

      properties.push({ kind: "Property", value, key });
      if (this.at().type != TokenType.FechaChave) {
        this.expect(
          TokenType.Virgula,
          "Esperada vírgula ou chave de fechamento após propriedade"
        );
      }
    }

    this.expect(TokenType.FechaChave, "Literal de objeto sem chave de fechamento.");
    return { kind: "ObjectLiteral", properties } as ObjectLiteral;
  }

  private parse_additive_expr(): Expr {
    let left = this.parse_multiplicitave_expr();

    while (this.at().value == "+" || this.at().value == "-") {
      const operator = this.eat().value;
      const right = this.parse_multiplicitave_expr();
      left = {
        kind: "BinaryExpr",
        left,
        right,
        operator,
      } as BinaryExpr;
    }

    return left;
  }

  private parse_multiplicitave_expr(): Expr {
    let left = this.parse_call_member_expr();

    while (
      this.at().value == "/" ||
      this.at().value == "*" ||
      this.at().value == "%"
    ) {
      const operator = this.eat().value;
      const right = this.parse_call_member_expr();
      left = {
        kind: "BinaryExpr",
        left,
        right,
        operator,
      } as BinaryExpr;
    }

    return left;
  }

  private parse_call_member_expr(): Expr {
    const member = this.parse_member_expr();

    if (this.at().type == TokenType.AbreParenteses) {
      return this.parse_call_expr(member);
    }

    return member;
  }

  private parse_call_expr(caller: Expr): Expr {
    let call_expr: Expr = {
      kind: "CallExpr",
      caller,
      args: this.parse_args(),
    } as CallExpr;

    if (this.at().type == TokenType.AbreParenteses) {
      call_expr = this.parse_call_expr(call_expr);
    }

    return call_expr;
  }

  private parse_args(): Expr[] {
    this.expect(TokenType.AbreParenteses, "Esperado parêntese de abertura");
    const args =
      this.at().type == TokenType.FechaParenteses ? [] : this.parse_arguments_list();

    this.expect(
      TokenType.FechaParenteses,
      "Faltando parêntese de fechamento na lista de argumentos"
    );
    return args;
  }

  private parse_arguments_list(): Expr[] {
    const args = [this.parse_assignment_expr()];

    while (this.at().type == TokenType.Virgula && this.eat()) {
      args.push(this.parse_assignment_expr());
    }

    return args;
  }

  private parse_member_expr(): Expr {
    let object = this.parse_primary_expr();

    while (
      this.at().type == TokenType.Ponto ||
      this.at().type == TokenType.AbreColchete
    ) {
      const operator = this.eat();
      let property: Expr;
      let computed: boolean;

      if (operator.type == TokenType.Ponto) {
        computed = false;
        property = this.parse_primary_expr();
        if (property.kind != "Identifier") {
          throw `Não é possível usar o operador ponto sem o lado direito ser um identificador`;
        }
      } else {
        computed = true;
        property = this.parse_expr();
        this.expect(
          TokenType.FechaColchete,
          "Faltando colchete de fechamento em valor computado."
        );
      }

      object = {
        kind: "MemberExpr",
        object,
        property,
        computed,
      } as MemberExpr;
    }

    return object;
  }

  private parse_primary_expr(): Expr {
    const tk = this.at().type;

    switch (tk) {
      case TokenType.Identificador:
        return { kind: "Identifier", symbol: this.eat().value } as Identifier;

      case TokenType.Numero:
        return {
          kind: "NumericLiteral",
          value: parseFloat(this.eat().value),
        } as NumericLiteral;

      case TokenType.AbreParenteses: {
        this.eat(); // Consome a abertura de parênteses
        const value = this.parse_expr();
        this.expect(
          TokenType.AbreParenteses,
          "Unexpected token found inside parenthesised expression. Expected closing parenthesis."
        ); // Fecha parênteses
        return value;
      }

      // Tokens não identificados
      default:
        console.error("Unexpected token found during parsing!", this.at());
        Deno.exit(1);
    }
  }
}
