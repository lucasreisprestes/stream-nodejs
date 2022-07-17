import http from 'http'
import { Readable } from 'stream'
import { randomUUID } from 'crypto'
/** 
 * Function Generator:
 * A forma de retornar um valor em cada iteração de uma função generator é incluir 
 * o valor após a palavra yield. Generators podem receber valores em cada pausa 
 * para continuar sua execução, podemos enviar valores de volta ao iterador passando
 * o valor como parâmetro ao método next. 
 */
function* run () {
    for(let index = 0; index <= 99; index++) {
        const data = {
            id: randomUUID(),
            name: `MyTest-${index}`
        }
        yield data
    }   
}

function handler (request, response) {

    const readable = new Readable({
        read() {
            for(const data of run()) {
                console.log(`sending`, data)
                this.push(JSON.stringify(data) + "\n")
            }
            //para informar que os dados acabaram 
            this.push(null)
        }
    })

    readable.pipe(response)

}
http.createServer(handler)
    .listen(3000)
    .on('listening', () => console.log('server running at 3000'))