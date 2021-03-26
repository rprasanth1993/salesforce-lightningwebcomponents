import { LightningElement,track ,api} from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { NavigationMixin } from 'lightning/navigation';
import PROJECT_OBJECT from '@salesforce/schema/Project__c';



export default class boxpopup extends LightningElement {
    @api
    myRecordId;
    redirect = true;
    resetpage = false;
    objectApiName = PROJECT_OBJECT;
    @track isModalOpen = false;
    openModal() {
        
        this.isModalOpen = true;
    }
    closeModal() {
        
        this.isModalOpen = false;
    }
    submitDetails() {
        
        this.isModalOpen = false;
    }

    
    handleSuccess(event) {
        const toastEvent = new ShowToastEvent({
            title: "Project created",
            message: "Record ID: " + event.detail.id,
            variant: "success"
        });
        this.dispatchEvent(toastEvent);

        if(this.redirect == true){
            console.log('handleSuccess'+this.redirect)
            let creditnoteId = event.detail.id;
           
            this[NavigationMixin.Navigate]({
                type: 'standard__recordPage',
                attributes: {
                    recordId:creditnoteId,
                    objectApiName:'Project__c',
                    actionName:'view'
                }
            })
        }
        if(this.resetpage== true){
            this.handleReset();
        }



    }

    handleError(event){
        const evt = new ShowToastEvent({
            title: 'Error!',
            message: event.detail.detail,
            variant: 'error',
            mode:'dismissable'
        });
        this.dispatchEvent(evt);
    }
    
    get acceptedFormats() {
        return ['.pdf', '.png','.txt'];
    }


    handleUploadFinished(event) {
        
        const uploadedFiles = event.detail.files;
        alert("No. of files uploaded : " + uploadedFiles.length);
    }


    handleCodeBlockButtonClick() {
        const inputRichText = this.template.querySelector('lightning-input-rich-text');
        let format = inputRichText.getFormat();

       
        if (format['code-block']) {
            inputRichText.setFormat({ 'code-block': false });
        } else {
            inputRichText.setFormat({ 'code-block': true });
        }
    }

    saveAndNew() {
        this.redirect = false;
        this.template.querySelector('lightning-record-edit-form').submit(this.fields);
        this.resetpage = true;
    }

    handleReset() {
        const inputFields = this.template.querySelectorAll(
            'lightning-input-field'
        );
        if (inputFields) {
            inputFields.forEach(field => {
                field.reset();
            });
        }
     }
     handleCancel(event){
        var url = window.location.href; 
        var value = url.substr(0,url.lastIndexOf('/') + 1);
        window.history.back();
        return false;
    }

}
