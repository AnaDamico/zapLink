
describe('Cadastro de Contatos', () => {

    const user = { email: 'Joao@ana.com.br', password: '15975473a' }

    before(() => {

        cy.request({
            method: 'POST',
            url: 'http://localhost:3000/user',
            headers: { 'Content-Type': 'application/json' },
            body: user,
            failOnStatusCode: false
        }).then((response) => {
            cy.log(JSON.stringify(response.body))
        })
        cy.doLogin(user.email, user.password)
        cy.get('.dashboard', { timeout: 5000 }).should('be.visible')
    })


    describe('Novo contato', () => {
        let contact = {
            name: 'Ana Carolina Santos', number: '1633358833', description: 'Teste Automatizado'
        }

        describe('Quando submeto o cadastro completo', () => {

            before(() => {
                cy.dash()
                cy.createContact(contact)
            })

            it('Deve cadastrar esse contato', () => {
                cy.contactList().contains(contact.name)
            })
        })

        describe('Quando submeto o cadastro sem o nome', () => {

            let contact = {
                number: '1633358833', description: 'Teste Automatizado'
            }

            before(() => {
                cy.dash()
                cy.createContact(contact)
            })

            it('Deve mostrar uma notificação', () => {
                cy.alertName().contains('Nome é obrigatório.')
            })
        })

        describe('Quando submeto o cadastro sem o whatsapp', () => {

            let contact = {
                name: 'Ana Carolina', description: 'Teste Automatizado'
            }

            before(() => {
                cy.dash()
                cy.createContact(contact)
            })

            it('Deve mostrar uma notificação', () => {
                cy.alertNumber().contains('WhatsApp é obrigatório.')
            })
        })


        describe('Quando submeto o cadastro sem o assunto', () => {

            let contact = {
                name: 'Ana Carolina', number: '1633358833'
            }

            before(() => {
                cy.dash()
                cy.createContact(contact)
            })

            it('Deve mostrar uma notificação', () => {
                cy.alertDesc().contains('Assunto é obrigatório.')
            })
        })

    })

})