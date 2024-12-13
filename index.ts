import * as fs from "fs";
import { interpretProgram } from "./interpreter";

function main() {
  try {
    // Ler o conteúdo do arquivo .prg
    const input = fs.readFileSync("programa_if.prg", "utf8");

    // Interpretar o programa e obter os resultados
    const result = interpretProgram(input);

    // Verificar se o resultado contém as variáveis
    if (!result || !result.variables) {
      console.error("Nenhum dado válido foi retornado pelo interpretador.");
      return;
    }

    const variables = result.variables;

    // Criar o conteúdo HTML para exibir os resultados
    const htmlContent = `
      <!DOCTYPE html>
      <html lang="pt-br">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Resultados do Programa</title>
          <style>
              body {
                  font-family: Arial, sans-serif;
                  margin: 20px;
              }
              h1 {
                  color: #333;
              }
              table {
                  border-collapse: collapse;
                  width: 100%;
                  margin-top: 20px;
              }
              th, td {
                  border: 1px solid #ddd;
                  padding: 8px;
              }
              th {
                  background-color: #f4f4f4;
                  text-align: left;
              }
          </style>
      </head>
      <body>
          <h1>Resultados do Programa</h1>
          <table>
              <tr>
                  <th>Variável</th>
                  <th>Valor</th>
              </tr>
              ${Object.entries(variables)
                .map(
                  ([name, value]) => `
                  <tr>
                      <td>${name}</td>
                      <td>${value}</td>
                  </tr>
              `
                )
                .join("")}
          </table>
      </body>
      </html>
    `;

    // Salvar o HTML em um arquivo
    const outputPath = "resultados.html";
    fs.writeFileSync(outputPath, htmlContent, "utf8");
    console.log(`Arquivo HTML gerado: ${outputPath}`);
  } catch (error) {
    console.error("Erro durante a execução:");
    console.error(error);
  }
}

main();
