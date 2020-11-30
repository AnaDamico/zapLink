
describe('Login', () => {

    const user = { email: 'anacarolina@ana.com.br', password: 'abc123456' }

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
    })


    context('Quando submeto credenciais validas', () => {
        before(() => {
            cy.doLogin(user.email, user.password)
        })

        it('Deve exibir a página dashboard', () => {
            cy.contains('h4', 'Seu gerenciador digital de contatos').should('be.visible')
        })
    })

    context('Quando submeto senha incorreta', () => {

        const expectMessage = 'Email e/ou senha incorretos!'

        before(() => {
            cy.doLogin(user.email, 'ac14846548')
        })

        it(`Deve exibir ${expectMessage.replace(/[^a-zA-Z]/g, '')}`, ()=> {
            cy.loginAlert(expectMessage).should('be.visible')
        })
    })

    context('Quando não informo o email', () => {
        before(() => {
            cy.doLogin('', 'ac14846548')
        })

        it('Deve exibir mensagem de alerta', () => {
            cy.loginAlert('Email não informado').should('be.visible')
        })
    })

    context('Quando não informo a senha', () => {
        before(() => {
            cy.doLogin('user.email', '')
        })

        it('Deve exibir mensagem de alerta', () => {
            cy.loginAlert('Senha não informada').should('be.visible')
        })
    })

})
