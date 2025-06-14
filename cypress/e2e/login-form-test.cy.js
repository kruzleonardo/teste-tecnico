import { loginFormPage } from "../pages/login-form"
import { secureAreaPage } from "../pages/secure-area"

const loginInformation = {
    username: 'tomsmith',
    password: 'SuperSecretPassword!',
    incorrectUsername: 'threshao',
    incorrectPassword: 'blitao'
}

const alertMessages = {
    invalidUsername: 'Your username is invalid!',
    invalidPassword: 'Your password is invalid!',
    successfulLogin: 'You logged into a secure area!',
    mustLoginFirst: 'You must login to view the secure area!'
}

const performLoginScenarioAndValidateOutcome = ({
    url,
    username,
    password,
    clickLoginButton = true,
    alertMessage
}) => {
    cy.visit(url)

    if (username) {
        cy.get(loginFormPage.elements.usernameInput).type(username)
    } else {
        cy.get(loginFormPage.elements.usernameInput).should('be.empty')
    }

    if (password) {
        cy.get(loginFormPage.elements.passwordInput).type(password)
    } else {
        cy.get(loginFormPage.elements.passwordInput).should('be.empty')
    }

    if (clickLoginButton) {
        cy.get(loginFormPage.elements.loginButton).click()
    }

    cy.get(loginFormPage.elements.alertMessage).should('contain', alertMessage)
}

describe(`As a user I would like to log into the system 
    so that I can access my personal account and be informed of any login issues`, () => {
    it(`Given I am on the login page
        When I enter a password but leave the username field empty
        And I click the login button
        Then I should see an error message saying "Your username is invalid!"`, () => {
        performLoginScenarioAndValidateOutcome({
            url: loginFormPage.url,
            password: loginInformation.password,
            alertMessage: alertMessages.invalidUsername
        })
    })

    it(`Given I am on the login page
        When I enter a username but leave the password field empty
        And I click the login button
        Then I should see an error message saying "Your password is invalid!"`, () => {
        performLoginScenarioAndValidateOutcome({
            url: loginFormPage.url,
            username: loginInformation.username,
            alertMessage: alertMessages.invalidPassword
        })
    })

    it(`Given I am on the login page
        When I enter a valid username and password
        And I click the login button
        Then I should be redirected to the dashboard
        And I should see a welcome message`, () => {
        performLoginScenarioAndValidateOutcome({
            url: loginFormPage.url,
            username: loginInformation.username,
            password: loginInformation.password,
            alertMessage: alertMessages.successfulLogin
        })
    })

    it(`Given I am on the login page
        When I enter an incorrect username or password
        And I click the login button
        Then I should see an error message saying "Invalid username or password"`, () => {
        performLoginScenarioAndValidateOutcome({
            url: loginFormPage.url,
            username: loginInformation.incorrectUsername,
            password: loginInformation.password,
            alertMessage: alertMessages.invalidUsername
        })

        performLoginScenarioAndValidateOutcome({
            url: loginFormPage.url,
            username: loginInformation.username,
            password: loginInformation.incorrectPassword,
            alertMessage: alertMessages.invalidPassword
        })
    })

    it(`Given I am not logged in
        When I navigate directly to the secure area URL
        Then I should be redirected to the login page
        And I should see a message saying "You must login to view the secure area!" `, () => {
        performLoginScenarioAndValidateOutcome({
            url: secureAreaPage.url,
            clickLoginButton: false,
            alertMessage: alertMessages.mustLoginFirst
        })
    })
})