import axios from 'axios'
import { Transform, Writable } from 'stream'
const url = 'https://sv11.hdradios.net:7430/'

async function consume() {
    const response = await axios({
        url,
        method: 'get',
        responseType: 'stream'
    })

    return response.data
}

const stream = await consume()
stream
    .pipe(
        new Transform({
            transform(chunk, enc, cb) {
                console.log('chunk ', chunk.toString())
                const item = JSON.parse(chunk)
                const myNumber = /\d+/.exec(item.name)[0]
                let name = item.name

                if (myNumber % 2 === 0) name = name.concat(' é par')
                else name = name.concat(' é impar')
                item.name = name

                cb(null, JSON.stringify(item))
            }
        })
    )
    .pipe(
        new Transform({
            transform(chunk, enc, cb) {
                cb(null, chunk.toString().toUpperCase())
            }
        })
    )
    .pipe(
        new Writable({
            write(chunk, enc, cb) {
                console.log('já chegou o disco voador ', chunk.toString())
                cb()
            }
        })
    )