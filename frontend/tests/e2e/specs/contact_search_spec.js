describe('Buscar Contato', () => {

    const user = { email: 'Marcia@ana.com.br', password: 'ab887799' }

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


    const contact = {
        name: 'João da Silva',
        number: '1633358338',
        description: 'Massa de teste com o usuário 1'
    }

    describe(`Dado que eu tenho o contato ${contact.name}`, () => {

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
            }).then((response) =>{
                cy.log(JSON.stringify(response.body))
            })

//failOnStatusCode: false =  tratamento para números duplicados e ignora no cypress as validações

        })

        it('Quando faço a busca esse contato', () => {

            cy.dash()
            cy.searchContact(contact.number)
            cy.get ('#loader', {timeout: 5000}).should('not.visible')

        })

        it('Devo ver esse somente contato no dashboard', () => {

            cy.contactItem().should('have.length', 1)
            cy.contactItem().contains(contact.name)
            cy.contactItem().contains(contact.description)
        })
    })

    context('Quando busco por um contato não cadastrado', () => {

        before(()=>{

            cy.dash()
            cy.searchContact('16123456789')
            cy.get ('#loader', {timeout: 5000}).should('not.visible')
        })

        it('Deve retornar mensagem de alerta', ()=> {
            cy.get('.message-body').contains('Não encontrado!')
        })
    })

})