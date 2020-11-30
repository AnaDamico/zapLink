const Code = require('@hapi/code');
const Lab = require('@hapi/lab');

const { init } = require('../server')

const { expect } = Code;
const { before, describe, it } = exports.lab = Lab.script();


describe('DELETE /contacts', () => {


    let userToken;

    before(async () => {

        const user = { email: 'carolina@ana.com.br', password: '102030' }

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

    describe('Dado que eu tenha um contato indesejado', () => {

        const contact = {
            name: 'Roberto Santos',
            number: '1633369874',
            description: 'Contato indesejado'
        }

        let server;
        let resp;
        let contactId;

        before(async () => {
            server = await init()

            resp = await server.inject({
                method: 'post',
                url: '/contacts',
                payload: contact,
                headers: { 'Authorization': userToken }
            })

            contactId = resp.result._id
        })


        it('Quando eu apagar esse contato', async () => {

            resp = await server.inject({
                method: 'delete',
                url: '/contacts/' + contactId,
                headers: { 'Authorization': userToken }
            })

        })

        it('Deve retornar 204', () => {
            expect(resp.statusCode).to.equal(204)
        })

    })

    describe('Dado que não tem acesso', () => {

        const contact = {
            name: 'Roberto Santos',
            number: '1633369874',
            description: 'Contato indesejado'
        }

        let server;
        let resp;
        let contactId;

        before(async () => {
            server = await init()

            resp = await server.inject({
                method: 'post',
                url: '/contacts',
                payload: contact,
                headers: { 'Authorization': userToken }
            })

            contactId = resp.result._id
        })


        it('Quando tentar apagar esse contato', async () => {

            resp = await server.inject({
                method: 'delete',
                url: '/contacts/' + contactId,
                headers: { 'Authorization': '5fb9c0777b6f783a944beabc' }
            })

        })

        it('Deve retornar 401', () => {
            expect(resp.statusCode).to.equal(401)
        })

    })


})