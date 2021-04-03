const http = require('http') 
const fs = require('fs')
const {readFile} = fs.promises

const hostname = '127.0.0.1'
const port = 7000
const path_static = './src/'

const api = {      // api - это набор действий, который производит сервер с данными
    'student': {
        'GET': () => {
            const data = memory.get('Ruban')
            console.log(data)
            return JSON.stringify(data)
        },
        'POST': body => {
            const data = JSON.parse(body)
            memory.set(data.surname, data)
            return `The student with params\n` + JSON.stringify(data) + '\n Succesfully posted'
        },
        'PUT': body => {
            const data = JSON.parse(body)
            memory.set(data.surname, data)
            return `The student updated\n` + JSON.stringify(data)
        }
    }
}

const memory = new Map() // Создаем коллекцию для сохранения данных

const MIME_TYPES = {
    html: 'text/html; charset=UTF-8',
    css: 'text/css',
    js: 'application/javascript',
    png: 'image/png',
    jpg: 'image/jpeg',
    mp4: 'video/mp4'
}

const getBody = req => new Promise((resolve) => {
    const buffer = [];
    req.on('data', chunk => {
        buffer.push(chunk)
    }).on('end', async () => {
        const body = buffer.join('')
        resolve(body)
    })
})

const sendStaticFiles = (url, res) => readFile(path_static + url).then(buffer => {
    const file_type = url.split('.')[1]
    res.writeHead(200, {'Content-Type': MIME_TYPES[file_type]})
    return buffer
})


const server = http.createServer()

server.on('request', async (req, res) => {
    let {url, method} = req
    console.log(`Received response from ${res.socket.remoteAddress}:${res.socket.remotePort}\n url: ${url}`)
    if (url.split('/')[1] == 'api') {
        const body = await getBody(req)
        try {
            const api_request = url.split('/')[2]
            let answer = api[api_request][method](body)
            res.statusMessage = 'ok' 
            res.end(answer)
        }
        catch (err){
            res.statusCode = '404'
            res.end(err.toString())
        }
    } else {
       url = url.split('/')[1] ? url : '/index.html'
       sendStaticFiles(url, res)
        .then(data => res.end(data))
        .catch(err => {
            res.writeHead(404, {'Content-Type': MIME_TYPES.html})
            res.end(`<h2>404: Not found file ${url}</h2>`)
        })
    }
})

server.on('error', err => {
    if (err.code == 'EACCES') {
        console.log(`No access to port ${port}`)
    }
})

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`)
})

