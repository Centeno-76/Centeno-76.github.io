const calcular = document.querySelector('#Calcular')
const calcularSeparatriz = document.querySelector('#CalcularSeparatriz')
const nomeInput = document.querySelector('#VarNome')
const valorInput = document.querySelector('#VarValor')
const inputArquivo = document.querySelector('#inputArquivo')

const selectSeparatriz = document.querySelector('#separatriz')
const numSeparatriz = document.querySelector('#numSeparatriz')
const resultSeparatriz = document.querySelector('#resultSeparatriz')
const tabela = document.querySelector(".tabela")
const medidas = document.querySelector('.medidas') //aqui puxa por
let arquivo = null
// captura arquivo e transforma em array
inputArquivo.addEventListener('change', event => {
  const reader = new FileReader();

  reader.readAsText(event.target.files[0]);

  reader.onloadend = () => {
    arquivo = reader.result.split('\n')
  }
})

selectSeparatriz.addEventListener('change', () => {
	const valor = selectSeparatriz.value

	numSeparatriz.innerHTML = ''
	for(let i = 1; i <= valor; i++) {
		const option = document.createElement('option')
		option.value = i
		option.innerText = i
		numSeparatriz.appendChild(option)
	}
})

// calcula os dados
calcular.addEventListener('click', () => {
  const tipoVar = document.querySelector('input[name="Inputs"]:checked').value;
  const TipoCalc = document.querySelector('#TipoCalc').value


  let nome, arrayValores, arrayValoresSujo
  let acumulador = 0
	let media, moda = [], mediana = []
	let linhas, intervalo
	let cv, desvio
	let fantSeparatriz

  if(arquivo) { // verifica se foi inserido algum arquivo
    nome = arquivo.shift()
    arrayValoresSujo = arquivo
  }
  else {
    nome = nomeInput.value
    arrayValoresSujo = valorInput.value.split(';')
  }

  // Limpa os espaços e remove os elementos vazios de cada vetor.
  arrayValores = arrayValoresSujo
    .filter(elemento => elemento != '')
    .map(elemento => elemento.trim()).sort((a,b)=> a - b)

  let Obj = {
    Titulo: "",
    Itens: {},
    vetFreqSimples: [],
    totalFreq: undefined,
    vetFreqAcc: [],
  }

  if (tipoVar != 'continua') {
    // Para cada elemento dentro do Array soma ao objeto Iten.
    arrayValores.forEach(elemento => {
      Obj.Itens.hasOwnProperty(elemento) ? Obj.Itens[elemento]++ : Obj.Itens[elemento] = 1
    })
    
  }
  else {
	  
    const vetNumeros = arrayValores.map(elemento => Number(elemento))

    const min = Math.min(...vetNumeros), max = Math.max(...vetNumeros)

    let amplitude = max - min

    const j = Math.trunc(arrayValores.length ** 0.5)
    const i = j - 1
    const k = j + 1

    do {
      amplitude++
      if(amplitude % i == 0) {
        linhas = i
        intervalo = amplitude / i
      }
      else if(amplitude % j == 0) {
        linhas = j
        intervalo = amplitude / j
      }
      else if(amplitude % k == 0) {
        linhas = k
        intervalo = amplitude / k
      }
    } while (!linhas)

    let inicio ,fim
    let objTemp = {}
    
    for(let i = 0; i < linhas; i++ ) {
      !inicio ? inicio = vetNumeros[0] : inicio = fim
      fim = inicio + intervalo
  
      const nomeAtributo = `${inicio} |--- ${fim}`
  
      vetNumeros.forEach(elemento => {
        if(elemento >= inicio && elemento < fim) objTemp[nomeAtributo]
          ? objTemp[nomeAtributo]++
          : objTemp[nomeAtributo] = 1
      })
    }

    Obj.Itens = objTemp
  }

  
  //Adiciona os elementos de Iten ao Obj Frequencia Simples
  for(const variavel in Obj.Itens) {
      Obj.vetFreqSimples.push(Obj.Itens[variavel])
    }
    
	// calcula quantidade total de itens
	Obj.totalFreq = Obj.vetFreqSimples.reduce((acc, act) => acc + act, 0)
	
	// calcula valores acumulados
	
	Obj.vetFreqSimples.map(elemento => Obj.vetFreqAcc.push(acumulador += elemento), 0)
    
	const maiorFreSimples = Math.max(...Obj.vetFreqSimples)
	const meioVetor = Math.trunc(arrayValores.length / 2)
	const valorCentral = arrayValores[meioVetor]

	
	if (tipoVar === 'nominal' || tipoVar === 'ordinal') {
		for (const elemento in Obj.Itens) {
			if (Obj.Itens[elemento] === maiorFreSimples) moda.push(elemento)
		}

		if (arrayValores.length % 2 === 0) {
			if (arrayValores[meioVetor] === arrayValores[meioVetor +1]) mediana.push(arrayValores[meioVetor])

			else mediana.push(arrayValores[meioVetor], arrayValores[meioVetor +1])

		} else mediana.push(arrayValores[meioVetor])

		calcularSeparatriz.addEventListener('click', () => { 
			const quadrante = Number(numSeparatriz.value)
			const se = Math.round(quadrante * (Obj.totalFreq -1) / Number(selectSeparatriz.value))
			resultSeparatriz.value = arrayValores[se]
		})
		
	}	else if (tipoVar === 'discreta') {
		media = arrayValores.reduce((acc, act) => acc + Number(act),0) / Obj.totalFreq

		for (const elemento in Obj.Itens) {
			if (Obj.Itens[elemento] === maiorFreSimples) moda.push(elemento)
		}
		
		if (arrayValores.length % 2 === 0) {
			if (arrayValores[meioVetor] === arrayValores[meioVetor +1]) mediana.push(arrayValores[meioVetor])

			else mediana.push(arrayValores[meioVetor], arrayValores[meioVetor +1])

		} else mediana.push(arrayValores[meioVetor])

		let soma = 0

		const valores = Object.keys(Obj.Itens)
		for (let i = 0; i < Obj.vetFreqSimples.length; i++) {
			soma += (Number(valores[i]) - media) ** 2 * Obj.vetFreqSimples[i]
		}
	
		if(TipoCalc === 'populacao') {
			desvio = Math.sqrt(soma / Obj.totalFreq)
			cv = (desvio / media) * 100
		} else { // amostra
			desvio = Math.sqrt(soma / (Obj.totalFreq - 1))
			cv = (desvio / media) * 100
		}

		calcularSeparatriz.addEventListener('click', () => { 
			const quadrante = Number(numSeparatriz.value)
			const se = Math.round(quadrante * (Obj.totalFreq -1) / Number(selectSeparatriz.value))
			resultSeparatriz.value = arrayValores[se]
		})

	} else {
		const vetLimites = []
		const vetLimiteInferior = []
		const vetLimiteSuperior = []

		let limiteInferior, fant, fimd, soma = 0
		
		for (const data in Obj.Itens){
			vetLimites.push((data.split(' |--- ')))
		}

		for (const vetor of vetLimites){
			vetLimiteInferior.push(Number(vetor[0]))
			vetLimiteSuperior.push(Number(vetor[1]))   
		}

		// ----Mediana Contínua---- \\
		for (let i = 0; i <= linhas; i++) {
			debugger
			if (valorCentral >= vetLimiteInferior[i] 
				&& valorCentral < vetLimiteSuperior[i]) {
						
				limiteInferior = vetLimiteInferior[i]

				// Caso não seja a primeira linha, deve usar Frq acumulada anterior
				if (i > 0) fant = Obj.vetFreqAcc[i - 1]
				// Caso seja a primeira linha a Frq acumulada anterior será 0
				else fant = 0

				fimd = Obj.vetFreqSimples[i] // frequencia simples da linha atual
				break
			}
		}
		debugger
		mediana = (limiteInferior + ((meioVetor - fant) / fimd) * intervalo)
		// ----Media Contínua---- \\
		for(let i = 0; i < linhas; i++){
			soma += ((vetLimiteInferior[i] + vetLimiteSuperior[i]) / 2)
				* Obj.vetFreqSimples[i]
		}
		media = (soma / Obj.totalFreq).toFixed(1)
		
		// ----Moda Contínua---- \\
		let indexMaiorFi = Obj.vetFreqSimples.indexOf(maiorFreSimples)

		moda = ((vetLimiteInferior[indexMaiorFi]
			+ vetLimiteSuperior[indexMaiorFi]) / 2).toFixed(0)

		
		// ----Desvio & CV Contínua---- \\
		let somaDesvio = 0
		let xi = []

		soma = 0

		for (let i = 0; i < linhas; i++) {
			const auxiliar = Number((vetLimiteInferior[i]
				+ vetLimiteSuperior[i]) / 2)
											
			xi.push(auxiliar)
			soma += xi[i] * Obj.vetFreqSimples[i]
		}
	
		for (let i = 0; i < linhas; i++) {
			somaDesvio += ((xi[i] - media) ** 2) * Obj.vetFreqSimples[i]
		}
	
		desvio = Math.sqrt(somaDesvio / Obj.totalFreq).toFixed(2)
		cv = ((Number(desvio) / Number(media)) * 100).toFixed(2)

		calcularSeparatriz.addEventListener('click', () => {
			const quadrante = Number(numSeparatriz.value)
			const se = Math.round(quadrante * (Obj.totalFreq -1) / Number(selectSeparatriz.value))
	
			const posicaoSeparatriz = arrayValores[se]
			let fantSeparatriz, fimdSeparatriz, limiteInferiorSeparatriz
	
			for(let i = 0; i < linhas; i++ ) {
				if(posicaoSeparatriz >= vetLimiteInferior[i] 
					&& posicaoSeparatriz < vetLimiteSuperior[i] ) {
					 
					if(i === 0) fantSeparatriz = 0
					else fantSeparatriz = Obj.vetFreqAcc[ i-1 ]
					
					limiteInferiorSeparatriz = vetLimiteInferior[i]
					fimdSeparatriz = Obj.vetFreqSimples[i]
					break
	
				}
			}
			
			resultSeparatriz.value = (limiteInferiorSeparatriz + ((( (se + 1) - fantSeparatriz)/ fimdSeparatriz) * intervalo)).toFixed(2)
		})
	}
    
  // Tabela
  let elementosTabela = `
  <tr>
    <th>${nome}</th>
    <th>Freq Simples</th>
    <th>Freq Simples %</th>
    <th>Freq Acumulada</th>
    <th>Freq Acumulada %</th>
  </tr>
  `

  let i = 0
  for(const variavel in Obj.Itens) {
    const linha = `
    <tr> 
      <td>${variavel}</td>
      <td>${Obj.Itens[variavel]}</td>
      <td>${((Obj.vetFreqSimples[i] * 100) / Obj.totalFreq).toFixed(2)}%</td>
      <td>${Obj.vetFreqAcc[i]}</td>
      <td>${((Obj.vetFreqAcc[i] * 100) / Obj.totalFreq).toFixed(2)}%</td>
    </tr>
    `
    i++
    elementosTabela += linha
	}
	
	tabela.innerHTML = elementosTabela
	debugger
	const caixas = `
		${media ? `<div>Media: ${(Number(media)).toFixed(2)}</div>` : `<div>Media: Não possui</div>`} 

		<div>Moda: ${moda}</div>
		<div>Mediana: ${(Number(mediana)).toFixed(2)}</div>

		${desvio ? `<div>Desvio Padrão: ${(Number(desvio)).toFixed(2)}</div>` : `<div>Desvio Padrão: Não possui</div>`} 

		${cv ? `<div>CV: ${(Number(cv)).toFixed(2)}%</div>` : `<div>CV: Não possui</div>`} 
	`
	medidas.innerHTML = caixas
	var ctx = document.getElementById('myChart').getContext('2d');
 var myChart = new Chart(ctx, {
 type: 'bar',
 data: {
	labels: Object.keys(Obj.Itens), //aqui tem que ir os nomes dos arquivos
	datasets: [{
		label: 'Estatística',
		data: Object.values(Obj.Itens), // aqui tem que ir os resultados das operações
		backgroundColor: [
			'rgba(255, 99, 132, 0.2)',
			'rgba(54, 162, 235, 0.2)',
			'rgba(255, 206, 86, 0.2)',
			'rgba(75, 192, 192, 0.2)',
			'rgba(153, 102, 255, 0.2)',
			'rgba(255, 159, 64, 0.2)'
		],
		borderColor: [
			'rgba(255, 99, 132, 1)',
			'rgba(54, 162, 235, 1)',
			'rgba(255, 206, 86, 1)',
			'rgba(75, 192, 192, 1)',
			'rgba(153, 102, 255, 1)',
			'rgba(255, 159, 64, 1)'
		],
		borderWidth: 6
	}]
},
options: {
	scales: {
		yAxes: [{
			ticks: {
				beginAtZero: true
			}
		}]
	}
}
});

})


 //Começa aqui a implementação dos gráficos da Descritiva.
 //Falta entender como os valores são lançados dentro de cada espaço
 //Talvez eu tenha que criar uma função para fazer trocar/aparecer e desaparecer os gráficos.
 //Ver onde estão os dados necessários e qual é o tipo de gráfico que deve ser lançado.
 

 //colocar os elementos da tabela aqui
 

