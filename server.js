const http = require('http')
const Koa = require('koa')
// const { koaBody } = require('koa-body')
const bodyParser = require('koa-bodyparser')
const cors = require('@koa/cors')

const app = new Koa()
app.use(cors())
app.use(bodyParser())
// app.use(koaBody({
//     urlencoded: true,
// }))

let currentDate = new Date()

tickets = [
    {
        id: 1,
        name: "test ticket 1",
        description: "start ticket for testing",
        status: true,
        created: currentDate.getTime()
    },
    {
        id: 2,
        name: "test ticket 2",
        description: "start ticket for testing start ticket for testing start ticket for testing start ticket for testing",
        status: false,
        created: currentDate.getTime()
    },
    {
        id: 3,
        name: "test ticket 3",
        description: "start ticket for testing start ticket for testing start ticket for testing ",
        status: false,
        created: currentDate.getTime()
    },
]

function getNextId() {
    let maxId = 0
    tickets.forEach(ticket => {
        if (ticket.id > maxId) {
            maxId = ticket.id
        }
    })
    return maxId + 1
}

app.use(async ctx => {
    const { method } = ctx.query
    const { id } = ctx.query

    if (!Number.isInteger(Number(id)) && id !== undefined) {
        ctx.throw(400, 'ID must be an integer'); 
      }

    const requestMethod = ctx.method

    switch(requestMethod) {
        case 'GET':
            // я хз зачем тут метод, если метод уже определяется, делаю по тз
            switch (method) {
                case 'allTickets':
                    ctx.response.body = tickets
                    return
                case 'ticketById':
                    if (!id) {
                        ctx.response.message = 'id required'
                        return
                    }
                    const ticketById = tickets.find(ticket => ticket.id == id)
                    const response = ticketById ? [ticketById] : []
                    ctx.response.body = response
                    return
                default:
                    ctx.response.status = 404
                    return
    }
        case 'POST':
            switch (method) {
                case 'createTicket':
                    const { name, description } = ctx.request.body
                    if (!name && !description) {
                        ctx.response.message = 'both name and description are required'
                        return
                    }
                    newTicket = {
                        id: getNextId(),
                        name: name,
                        description: description,
                        status: false,
                        created: currentDate.getTime()
                    }
                    tickets.push(newTicket)
                    ctx.response.status = 201
                    ctx.response.body = [newTicket]
                    return
                default:
                    ctx.response.status = 404
                    ctx.response.message = 'cant create ticket'
                    return
            }
        case 'PATCH':
            switch (method) {
                case 'patchTicket':
                    const { name, description, status } = ctx.request.body
                    if (!id) {
                        ctx.response.message = 'id required'
                        return
                    }
                    patchingTicket = tickets.find(ticket => ticket.id == id)
                    if (!patchingTicket) {
                        ctx.throw(400, `cant find ticket with id ${id}`)
                    }
                    if (name) {
                        patchingTicket.name = name
                    }
                    if (description) {
                        patchingTicket.description = description
                    }
                    if (typeof status === 'boolean') {
                        patchingTicket.status = status
                    }
                    ctx.response.body = [patchingTicket]
                    return
                default:
                    ctx.response.status = 404
                    ctx.response.message = 'cant patch ticket'
                    return
            }
        case 'DELETE':
            switch(method) {
                case 'deleteTicket':
                    if (!id) {
                        ctx.response.message = 'id required'
                        return
                    }
                    deletingTicket = tickets.find(ticket => ticket.id == id)
                    if (!deletingTicket) {
                        ctx.throw(400, `cant find ticket with id ${id}`)
                    }
                    const indexToDelete = tickets.findIndex(ticket => ticket.id === deletingTicket.id);
                    tickets.splice(indexToDelete, 1)
                    ctx.response.body = []
                    ctx.response.status = 204
                    return
                default:
                    ctx.response.status = 404
                    ctx.response.message = 'cant delete ticket'
                    return
            }
    }
})

// app.use((ctx, next) => {
//     console.log(ctx.request.body)

//     ctx.response.body = 'server response'
//     next()
// })
// app.use((ctx) => {
//     console.log('next middleware')
// })

const server = http.createServer(app.callback())
const port = 7070
server.listen(port, (err) => {
    if (err) {
        console.log(err)
        return
    }
    console.log('Server is listenin to ' + port)
})