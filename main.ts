import Parser from "./src/frontend/parser.ts";
import { createGlobalEnv } from "./src/runtime/environment.ts";
import { evaluate } from "./src/runtime/interpreter.ts";

run("./src/test/test.txt");

async function run(filename: string) {
  const parser = new Parser();
  const env = createGlobalEnv();

  const input = await Deno.readTextFile(filename);
  const program = parser.produceAST(input);

  const result = evaluate(program, env);
  console.log(result);
}
