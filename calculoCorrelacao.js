const calcular = document.querySelector('#calcular')
const calcularRegressaoX = document.querySelector('#calcularRegressaoX')
const calcularRegressaoY = document.querySelector('#calcularRegressaoY')

const inputX = document.querySelector('#inputX')
const inputY = document.querySelector('#inputY')
const inputArquivo = document.querySelector('#arquivoCorrelação')
const textoCorrelacao = document.querySelector('.textoCorrelacao')

let arquivo = null
// captura arquivo e transforma em array
inputArquivo.addEventListener('change', event => {
  const reader = new FileReader();

  reader.readAsText(event.target.files[0]);

  reader.onloadend = () => {
    arquivo = reader.result.split('\n')
  }
})

calcular.addEventListener('click', () => {
  let vetorX = [], vetorY = []

  if(arquivo) { // verifica se foi inserido algum arquivo
    let vetorLimpo = arquivo.map(elemento => elemento.trim())
    while (vetorLimpo.includes('') || vetorLimpo.includes(';')) {
      vetorLimpo.pop()
    }

    vetorLimpo = vetorLimpo.map(elemento => elemento.split(';'))
    vetorLimpo.shift()

    vetorLimpo.forEach(vetLinha => {
      vetorX.push(vetLinha[0])
      vetorY.push(vetLinha[1])
    });
  }
  else {
    vetorX = inputX.value.split(';')
    vetorY = inputY.value.split(';')
  }

  vetorX = vetorX.filter(elemento => elemento != '')
    .map(elemento => elemento.trim())

  vetorY = vetorY.filter(elemento => elemento != '')
    .map(elemento => elemento.trim())

    const somaX = vetorX.map(numero => Number(numero)).reduce((a,b) => a + b)
    const somaY = vetorY.map(numero => Number(numero)).reduce((a,b) => a + b)
    const n = vetorX.length
    
    let somaXY = 0
    let somaX2 = 0
    let somaY2 = 0

    //faz os calculos para as demais colunas da correlação
    for(let i = 0; i < n; i++){
      somaXY += Number(vetorX[i] * vetorY[i])
      somaX2 += Number(vetorX[i]**2)
      somaY2 += Number(vetorY[i]**2)
    }

    const r = ((n * somaXY) - (somaX * somaY))
      / ((((n * somaX2) - (somaX**2))**(1/2))
      * (((n * somaY2) - (somaY**2))**(1/2)))

    let tipoCorrelacao

    if (r == 1) tipoCorrelacao = 'Perfeita Positiva'
  
    else if (r == -1) tipoCorrelacao = 'Perfeita Negativa'
    
    else if (r == 0) tipoCorrelacao = 'Variéveis não correlacionadas'
    
    else if (r > 0 && r < 0.30) tipoCorrelacao = 'Fraca Positiva'
    
    else if (r < 0 && r > -0.30) tipoCorrelacao = 'Fraca Negativa'
    
    else if (r > 0.3 && r < 0.7) tipoCorrelacao = 'Moderada Positiva'
    
    else if (r < -0.3 && r > - 0.7) tipoCorrelacao = "Moderada Negativa"
    
    else if (r > 0.7 && r < 1) tipoCorrelacao = 'Forte Positiva'
    
    else tipoCorrelacao = 'Forte Negativa'

    
    // Exibe o valor da Correlação
    textoCorrelacao.innerHTML = `Correlação ${tipoCorrelacao} de ${(r*100).toFixed(2)}%`  
  
    // realiza o calculo da regressão de acordo com a variavel digitada
    calcularRegressaoX.addEventListener('click', () => {
      const regressaoX = document.querySelector('#regressaoX').valueAsNumber

      const a = (((n * somaXY) - (somaY * somaX))/((n * somaY2) - somaX2 ** 2))

      const b = (somaY - a * somaX) / n
      
      const regressao =  Number(a * regressaoX) + b 
      
      document.querySelector('#resultadoX').value = (regressao).toFixed(2)
    })
  
    calcularRegressaoY.addEventListener('click', () => {
      debugger
      const regressaoY = document.querySelector('#regressaoY').valueAsNumber

      const a = (((n * somaXY) - (somaY * somaX))/((n * somaY2) - somaX2 ** 2))
      const b = (somaY - a * somaX) / n
      
      const regressao = (a * regressaoY) + b
      
      document.querySelector('#resultadoY').value = regressao.toFixed(2)
    })
})