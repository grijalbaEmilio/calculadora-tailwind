'use enteroict'

var subCadenas = []
const objButtons = [
    { class: 'btn-operand', value: '1' },
    { class: 'btn-operand', value: '2' },
    { class: 'btn-operand', value: '3' },
    { class: 'btn-operator', value: '+' },
    { class: 'btn-operand', value: '4' },
    { class: 'btn-operand', value: '5' },
    { class: 'btn-operand', value: '6' },
    { class: 'btn-operator', value: '-' },
    { class: 'btn-operand', value: '7' },
    { class: 'btn-operand', value: '8' },
    { class: 'btn-operand', value: '9' },
    { class: 'btn-operator', value: '*' },
    { class: 'btn-operand', value: '0' },
    { class: 'btn-operand', value: '.' },
    { class: 'btn-clear', value: 'C' },
    { class: 'btn-operator', value: '/' },
    { class: 'btn-operator', value: '(' },
    { class: 'btn-operator', value: ')' },
    { class: 'btn-borrar', value: '&#x2190' },
    { class: 'btn-equals', value: '=' }
]

let number = '' // Puede requerirse como una variable auxiliar para guardar números
let displayData = '' // La expresión aritmética que se irá moenteroando 
let error = false // Puede requerirse para controlar estados de error

document.addEventListener('DOMContentLoaded', event => {
    const divButtons = document.querySelector('.buttons')
    const display = document.querySelector('.display')

    objButtons.forEach(objButton => {
        const item = `<button class="${objButton.class}">${objButton.value}</button>`
        divButtons.insertAdjacentHTML('beforeend', item) //se agrega cada ítem antes del final del contenedor
    })

    const buttons = document.querySelectorAll('.btn-operand, .btn-operator')



    buttons.forEach(button => {
        button.addEventListener('click', event => {
            const item = event.target.innerText //event.target obtiene el nodo sobre el cual se da click
            //innerText obtiene el texto del nodo

            displayData += item
            display.value = displayData
            chec(displayData)
            //------------------- no permite ingresar más de un punto por número------(2)
            let l = separaCadena(displayData)
            checPuntos(l)
        })
    })
    document.querySelector('.btn-equals').addEventListener('click', event => {       
       igual()
    })

    function igual(){ // se hizo función con el fin de reusarla
        //--------------- sólo se evalúa si los paréntesis están bien balanceados ------(8)
        //--------------- si se produce error se muestra en el display y se reinicia displayData------(9)
        if (!parentesisBien(displayData)) {
            console.log('Error! paréntesis mal balanceados')
            display.value = 'Error!'
            displayData = ''
        } else {
            try {
                //--------------- en caso del resultado tener decimales se mostrarán máximo 8------(11)
                var aux = eval(displayData).toFixed(8) //ojo con eval()
                //--------------- se normaliza el error de divición po cero -----(12)
                if (aux == 'Infinity' || isNaN(aux)) {
                    display.value = 'Error!'
                    displayData = ''

                } else {
                    display.value = parseFloat(aux)
                }
            } catch (e) {
                console.log(e)
                display.value = 'Error!'
                displayData = ''
            }
            (aux == 'Infinity' || isNaN(aux)) ? null : displayData = display.value
        }
    }
    document.querySelector('.btn-clear').addEventListener('click', event => {
        displayData = ""
        display.value = displayData
    })

    document.querySelector('.btn-borrar').addEventListener('click', e => {
        displayData = displayData.slice(0, -1)
        display.value = displayData
    })

    function chec(cadena) {
        var ultimo = cadena.slice(-1) //último caracter del display

        //--------------- no permite abrir paréntesis inmediatamente depués de un número entero------(3)
        var penUltimo = cadena.slice(-2, -1) //penúltimo caracter del display
        if (ultimo == '(') {
            if ('0123456789'.includes(penUltimo) && penUltimo != '') {
                displayData = displayData.slice(0, -1)
                display.value = displayData
                console.log('Error! no se puede abrir paréntesis')
            }
        }

        //--------------- no permite cerrar paréntesis inmediatamente depués de “+”, ”-”, “*”, “/” y “(“-------(4)
        if (ultimo == ')') {
            if ('+-*/('.includes(penUltimo)) {
                displayData = displayData.slice(0, -1)
                display.value = displayData
                console.log('Error! no se puede cerrar paréntesis')
            }
        }

        //-------------- no permite empezar con ")", "/" o "*" ----------------(5)
        if (')*/'.includes(cadena[0])) { // el primer caracter es ")", "/" o "*"?
            displayData = displayData.slice(0, -1)
            display.value = displayData
        }

        //--------------- no permite usar dos operadores seguidos------(6)
        if ('+-*/'.includes(ultimo)) {
            if ('+-*/'.includes(penUltimo) && penUltimo != '') {
                displayData = displayData.slice(0, -1)
                display.value = displayData
                console.log('Error! no se puede usar el operador "' + ultimo + '"')
            }
        }

        //--------------- permite sólo "-" o "+" después de abrir paréntesis ------(7)
        if ((penUltimo == '' || penUltimo == '(') && '*/'.includes(ultimo)) {
            displayData = displayData.slice(0, -1)
            display.value = displayData
            console.log('Error! no se puede usar el operador "' + ultimo + '"')
        }

    }

    /**
     * 
     * @param {String} cadena cadena de caracteres, por ejemplo 23+(12*2)-(3)
     * @returns {Boolean} true si la cantidad de parentesis de apertura y cierre coinciden, false de lo contrario
     */
    function parentesisBien(cadena) {
        let abre = 0
        let cierra = 0

        for (let i = 0; i < cadena.length; i++) {
            if (cadena[i] == '(') {
                ++abre
            } else if (cadena[i] == ')') {
                ++cierra
            }
        }
        if (abre != cierra) {
            return false
        } else {
            return true
        }
    }

    let separa = []
    /**
     * 
     * @param {String} cadena 
     * @returns {Array} arreglo con las subcadenas divididas por los operadores "+", "-", "*" y "/"
     */
    function separaCadena(cadena) {
        let aux = []

        cadena = cadena.split('+')

        for (let i = 0; i < cadena.length; i++) {
            const cadMenos = cadena[i].split('-')
            for (let n = 0; n < cadMenos.length; n++) {
                const cadPor = cadMenos[n].split('*')
                for (let m = 0; m < cadPor.length; m++) {
                    const cadDiv = cadPor[m].split('/')
                    for (let u = 0; u < cadDiv.length; u++) {
                        const cadFin = cadDiv[u]
                        aux.push(cadFin)
                    }
                }
            }
        }
        separa = aux
        return separa
    }

    /**
     * 
     * @param {Arrar} array arreglo de Strings
     * @returns {Boolean} true si ninguno de los String contiene más de dos puntos, false de lo contarrio
     */
    function checPuntos(array) {
        let puntos
        for (let i = 0; i < array.length; i++) {
            puntos = 0
            for (let n = 0; n < array[i].length; n++) {
                if (array[i][n] == '.') {
                    ++puntos
                }
                if (puntos > 1) {
                    displayData = displayData.slice(0, -1)
                    display.value = displayData
                    console.log('Error! no se admiten mas de un punto por número')
                    return true
                }
            }
        }
        return false
    }
    //---------------------------------- funcionalidad con el teclado------(14)
    display.addEventListener('input', e => {
        let value = display.value
        let ultimo = value.slice(-1)
        if (!'1234567890().+-*/'.includes(ultimo)) {
            display.value = value.slice(0, -1)
        } else {
            displayData = value
            chec(displayData)

            let l = separaCadena(displayData)
            checPuntos(l)
        }
    })

    display.addEventListener('keydown', e => {
        if (e.key == 'Enter') {
            igual()
        }
    })
})