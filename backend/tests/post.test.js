const Code = require('@hapi/code');
const Lab = require('@hapi/lab');

const { init } = require('../server')

const { expect } = Code;
const { before, describe, it } = exports.lab = Lab.script();

describe('POST /contacts', () => {

    let resp;
    let userToken;

    before(async () => {

        const user = { email: 'ana@ana.com.br', password: '123456' }

        var server = await init();

        await server.inject({
            method: 'post',
            url: '/user',
            payload: user
        })

        resp = await server.inject({
            method: 'post',
            url: '/session',
            payload: user
        })

        userToken = resp.result.user_token

    })

    describe('quando não tenho acesso', () => {

        before(async () => {
            var server = await init();

            resp = await server.inject({
                method: 'post',
                url: '/contacts',
                payload: null,
                headers: { 'Authorization': '5fb9c0777b6f783a944beabc' }
            })
        })

        it('deve retornar 401', async () => {
            expect(resp.statusCode).to.equal(401)
        })

    })


    describe('quando o payload é nulo', () => {

        before(async () => {
            var server = await init();

            resp = await server.inject({
                method: 'post',
                url: '/contacts',
                payload: null,
                headers: { 'Authorization': userToken }
            })
        })

        it('deve retornar 400', async () => {
            expect(resp.statusCode).to.equal(400)
        })

    })


    describe('quando o payload é bonito', () => {

        before(async () => {
            var server = await init();

            let contact = {
                name: "Ana Xpto",
                number: "1633312255",
                description: "Teste Xpto"
            }

            resp = await server.inject({
                method: 'post',
                url: '/contacts',
                payload: contact,
                headers: { 'Authorization': userToken }
            })
        })

        it('deve retornar 200', async () => {
            expect(resp.statusCode).to.equal(200)
        })

        it('deve retornar o id do contato', async () => {
            expect(resp.result._id).to.be.a.object()
            expect(resp.result._id.toString().length).to.equal(24)
        })

    })

    describe('quando o contato já existe', () => {

        before(async () => {
            var server = await init();

            let contact = {
                name: "Ana Duplicado",
                number: "1633312253",
                description: "Teste Xpto"
            }

            await server.inject({
                method: 'post',
                url: '/contacts',
                payload: contact,
                headers: { 'Authorization': userToken }
            })

            resp = await server.inject({
                method: 'post',
                url: '/contacts',
                payload: contact,
                headers: { 'Authorization': userToken }
            })
        })

        it('deve retornar 409', async () => {
            expect(resp.statusCode).to.equal(409)
        })


    })



    describe('quando o payload não tem nome', () => {
        before(async () => {
            var server = await init();

            let contact = {
                number: "1633312240",
                description: "Teste"
            }

            resp = await server.inject({
                method: 'post',
                url: '/contacts',
                payload: contact,
                headers: { 'Authorization': userToken }
            })

        })

        it('deve retornar 409', async () => {
            expect(resp.statusCode).to.equal(409)
        })

        it('deve retornar uma mensagem', async () => {
            expect(resp.result.message).to.equal('Name is required.')
        })

    })

    describe('quando o nome está em branco', () => {
        before(async () => {
            var server = await init();

            let contact = {
                name: "",
                number: "1633312243",
                description: "Teste"
            }

            resp = await server.inject({
                method: 'post',
                url: '/contacts',
                payload: contact,
                headers: { 'Authorization': userToken }
            })

        })

        it('deve retornar 409', async () => {
            expect(resp.statusCode).to.equal(409)
        })


        it('deve retornar uma mensagem', async () => {
            expect(resp.result.message).to.equal('Name is required.')
        })


    })


    describe('quando o payload não tem o whatsapp', () => {
        before(async () => {
            var server = await init();

            let contact = {
                name: "Teste",
                description: "Teste"
            }

            resp = await server.inject({
                method: 'post',
                url: '/contacts',
                payload: contact,
                headers: { 'Authorization': userToken }
            })

        })

        it('deve retornar 409', async () => {
            expect(resp.statusCode).to.equal(409)
        })

        it('deve retornar uma mensagem', async () => {
            expect(resp.result.message).to.equal('Number is required.')
        })


    })



    describe('quando whatsapp está em branco', () => {
        before(async () => {
            var server = await init();

            let contact = {
                name: "Teste",
                number: "",
                description: "Teste"
            }

            resp = await server.inject({
                method: 'post',
                url: '/contacts',
                payload: contact,
                headers: { 'Authorization': userToken }
            })

        })

        it('deve retornar 409', async () => {
            expect(resp.statusCode).to.equal(409)
        })

        it('deve retornar uma mensagem', async () => {
            expect(resp.result.message).to.equal('Number is required.')
        })


    })



    describe('quando o payload não tem o assunto', () => {
        before(async () => {
            var server = await init();

            let contact = {
                name: "Teste",
                number: "1633310120"
            }

            resp = await server.inject({
                method: 'post',
                url: '/contacts',
                payload: contact,
                headers: { 'Authorization': userToken }
            })

        })

        it('deve retornar 409', async () => {
            expect(resp.statusCode).to.equal(409)
        })

        it('deve retornar uma mensagem', async () => {
            expect(resp.result.message).to.equal('Description is required.')
        })


    })


    describe('quando o payload não tem o assunto', () => {
        before(async () => {
            var server = await init();

            let contact = {
                name: "Teste",
                number: "1633310121",
                Description: ""
            }

            resp = await server.inject({
                method: 'post',
                url: '/contacts',
                payload: contact,
                headers: { 'Authorization': userToken }
            })

        })

        it('deve retornar 409', async () => {
            expect(resp.statusCode).to.equal(409)
        })

        it('deve retornar uma mensagem', async () => {
            expect(resp.result.message).to.equal('Description is required.')
        })


    })


})

