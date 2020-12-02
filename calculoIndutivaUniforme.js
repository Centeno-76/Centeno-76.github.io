const calcular = document.querySelector("#calcularUniforme")
const resultadosUniforme = document.querySelector('.resultadosUniforme')

calcular.addEventListener('click', () => {
  debugger
  //Captura dos dados 
  const a = document.querySelector('#minimo')
  const b = document.querySelector('#maximo')
  const tipoIntevalo = document.querySelector('#tipoIntervaloUniforme')
  const dist = document.querySelector('#distancia')
  
  // declaração das variaveis
  let probabilidade, media, desvio

  //Criação de um vetor para alocar os limtes para o calculo
    
  //Teste condicional para a definição do calculo da probabilidade
  if(tipoIntevalo.value === 'maior') probabilidade = ((1 / (b.value - a.value) * (b.value - Number(dist.value)))
    * 100)
    .toFixed(2)

  else if(tipoIntevalo.value === 'menor') probabilidade = ((1 / (b.value - a.value) * (Number(dist.value) - a.value))
    * 100)
    .toFixed(2)
  
  else {
    const vetDist = dist.value.split(';').map(value => Number(value))
    const [menor, maior] = vetDist.sort((a,b) => a - b)

    probabilidade = ((1 / (Number(b.value) - Number(a.value)) * Number(maior - menor)) * 100)
    .toFixed(2)
  }
  //Calculo da Média
  media = ((Number(b.value) + Number(a.value)) / 2).toFixed(2)
  //Calculo do Devio Padrão 
  desvio = ((((Number(b.value) - Number(a.value))**2) / 12)**(1/2)).toFixed(2)

  //Impressão dos resultados
  resultadosUniforme.innerHTML = `
  <p>Probabilidade: ${probabilidade}%</p>

  <p>Média: ${media}</p>

  <p>Desvio padrão: ${desvio}</p>
  `
})