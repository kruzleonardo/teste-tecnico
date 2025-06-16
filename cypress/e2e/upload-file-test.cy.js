import { uploadPage } from "../pages/upload-area"
import 'cypress-file-upload'

const fileNames = [
    'dummy.pdf',
    'example.json',
    'pdf_sample_2.pdf'
]

const uploadFilesAndValidateSuccessMessageAndFilesList = ({
    uploadType,
    files
}) => {
    cy.visit(uploadPage.url)
    switch (uploadType) {
        case 'Button':
            cy.get(uploadPage.uploadInput).attachFile(files)
            cy.get(uploadPage.uploadButton).click()
            cy.contains('File Uploaded!').should('be.visible')
            cy.get(uploadPage.uploadedFiles).should('contain', files)
            break
        case 'Drag And Drop':
            files.forEach((file) => {
                cy.get(uploadPage.dragAndDropUpload).attachFile(file, { subjectType: 'drag-n-drop' })
            })
            files.forEach((file) => {
                cy.get(uploadPage.dragAndDropUpload).should('contain', file)
            })
            break
    }
}

describe(`As a user I want to upload one or more files using either the upload button or drag-and-drop area, so that I can add my files quickly and flexibly.`, () => {
    it(`Given I am on the file upload page
        When I upload a file
        And I click on the Upload button
        Then the file should appear in the upload list
        And I should see a success message`, () => {
        uploadFilesAndValidateSuccessMessageAndFilesList({
            uploadType: 'Button',
            files: fileNames[0]
        })
    })

    it(`Given I am on the file upload page
        When I drag a file over the highlighted upload area
        And I drop it into the area
        Then the file should appear in the upload list`, () => {
        uploadFilesAndValidateSuccessMessageAndFilesList({
            uploadType: 'Drag And Drop',
            files: [fileNames[1]]
        })
    })

    it(`Given I am on the file upload page
        When I upload multiple files using the "Choose File" button
        And I upload multiple files using the drag and drop area
        Then all selected files should appear in the upload list
        And I should see a success message`, () => {
        uploadFilesAndValidateSuccessMessageAndFilesList({
            uploadType: 'Drag And Drop',
            files: fileNames
        })
    })
})