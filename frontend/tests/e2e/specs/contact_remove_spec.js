describe('Remover Contato', () => {

    const user = { email: 'mariane@ana.com.br', password: 'xayz159753' }

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
        cy.get('.dashboard', { timeout: 15000 }).should('be.visible')
    })

    const contact = {
        name: 'Ana Luisa',
        number: '1633358331',
        description: 'Professora de Inglês'
    }

    describe(`Dado que ${contact.name} é um contato para exclusão`, () => {

        before(() => {
            // cy.dash()
            // cy.createContact(contact)         

            //Testes com a API

            cy.request({
                method: 'POST',
                url: 'http://localhost:3000/contacts',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem('user_token')
                },
                body: contact,
                failOnStatusCode: false
            }).then((response) => {
                cy.log(JSON.stringify(response.body))
            })

            //failOnStatusCode: false =  tratamento para números duplicados e ignora no cypress as validações

        })

        it('Quando excluo esse contato', () => {

            cy.dash()
            //cy.contains('.card', contact.number).find('.btn-remove').click() -> commands
            //cy.getContact(contact.number).find('.btn-remove').click()

            cy.removeContact(contact.number)

        })

        it('Não deve ser exibido no dashboard', () => {
            //cy.contains('.card', contact.number).should('not.visible')

            cy.getContact(contact.number).should('not.visible')

        })

    })

})