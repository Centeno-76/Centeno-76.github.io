import tabela from './tabelaNormal.js'

const calcular = document.querySelector("#calcularNormal")
const inputMedia = document.querySelector("#mediaNormal")
const InputDesvio = document.querySelector("#desvioNormal")
const opt_intervalo = document.querySelector("#tipoIntervaloNormal")
const InputIntervalo = document.querySelector("#intervalo")

const resultadosNormal = document.querySelector('.resultadosNormal')

calcular.addEventListener('click', () => {
  let i, y, z, coluna, linha, p, probabilidade_int
  let prob = []
  
  const valorMedia = inputMedia.valueAsNumber
  const valorDesvio = InputDesvio.valueAsNumber
  const valorIntervalo = InputIntervalo.value.replace(',', '.')

  let vetIntervalo = valorIntervalo.split(';').map(num => Number(num))
  // Teste condicional para determinar como serão feitos os calculos    

  if (opt_intervalo.value == 'maior' || opt_intervalo.value == 'menor') {   
    // Calculo para a busca da linha e coluna na tabela da Distribuição Normal  
    z = (vetIntervalo[0] - valorMedia) / valorDesvio
    if (z < 0) z *= -1 // se o número for negativo, ele passa para positivo

    i = z.toFixed(2)
    y = [...i]

    linha = Number(y[0] + y[2])
    coluna = Number(i[3])
    debugger
    if(linha <= 39)  p = tabela[linha][coluna]
    else p = 0.5000
    
    // Teste condicional para determinar o calculo da probabilidade 
    if (opt_intervalo.value == 'maior') { // maior
      if (vetIntervalo[0] > valorMedia.value) probabilidade_int = ((0.5 - p) * 100).toFixed(2)
          
      else probabilidade_int = ((0.5 + p) * 100).toFixed(2)
            
    } else { // menor
      if (vetIntervalo[0] <= valorMedia.value)  probabilidade_int = ((0.5 - p) * 100).toFixed(2)
        
      else  probabilidade_int = ((0.5 + p) * 100).toFixed(2)
    }

  } else {

    for (let int of vetIntervalo) {
      // Calculo para a busca da linha e coluna na tabela da Distribuição normal
      if (int != valorMedia) {
        
        z = (int-valorMedia)/valorDesvio
       
        if (z < 0)  z = z * -1
               
        i = z.toFixed(2)
        y = [...i]
    
        linha = parseFloat(y[0] + y[2])
        coluna = parseInt(i[3])

        if(linha <= 39)  p = tabela[linha][coluna]
        else p = 0.5000
            
        prob.push(p)   
      }
    }

    //Teste condicional para determinar o calculo da probabilidade
    if (vetIntervalo[0] < valorMedia.value && vetIntervalo[1] > valorMedia.value) 
      probabilidade_int = ((prob.reduce((a,b) => a + b))*100).toFixed(2)

    else if (vetIntervalo[0] < vetIntervalo[1] && vetIntervalo[0] < valorMedia.value) 
      probabilidade_int = ((prob.reduce((a,b) => a - b))*100).toFixed(2)
    
    else probabilidade_int = ((prob.reduce((a,b) => b - a))*100).toFixed(2)
    
  }
//Impressão dos resultados
  resultadosNormal.innerHTML = `
    <p>Probabilidade: ${probabilidade_int}%</p>
    `
})