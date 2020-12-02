const calcular = document.querySelector("#calcularBinomial")
const InputAmostra = document.querySelector("#amostraBinomial")
const InputSucesso = document.querySelector("#sucesso")
const InputFracasso = document.querySelector("#fracasso")
const InputEvento = document.querySelector("#evento")

const resultadosBinomial = document.querySelector('.resultadosBinomial')

//CÁLCULO DO FATORIAL
function Fatorial(n) {
  if (n === 0) return 1;
  if (n === 1) return 1;
  return n * Fatorial(n-1)
}

calcular.addEventListener('click', () => {
  debugger
  const valorAmostra = InputAmostra.valueAsNumber
  const valorSucesso = InputSucesso.valueAsNumber
  const valorFracasso = InputFracasso.valueAsNumber
  const valorEvento = InputEvento.value.split(';').map(Number)
  

  let probabilidade = 0;
  let media = 0;
  let desvio = 0;
  let variacao = 0;

  for (let i = 0; i < valorEvento.length; i ++) {
    const kFatorial = Fatorial(valorEvento[i]);
    const nFatorial = Fatorial(valorAmostra);
    const k = valorEvento[i]
    const n = valorAmostra;

    probabilidade += nFatorial /(Fatorial(n-k) * kFatorial)
      * Math.pow(valorSucesso, k) * Math.pow(valorFracasso, n - k);

    media = n * valorSucesso;
    desvio = Math.sqrt(n * valorSucesso * valorFracasso);
  }

  resultadosBinomial.innerHTML = `
  <p>Probabilidade: ${(probabilidade*100).toFixed(2)}%</p>
  <p>Média: ${media}</p>
  <p>Desvio padrão: ${(desvio).toFixed(2)}</p>
  `
})