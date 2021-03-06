import { LightningElement, track, wire,api } from "lwc";
import { getPicklistValues } from 'lightning/uiObjectInfoApi';
import PROJECT_OBJECT from '@salesforce/schema/Project__c';
import STATUS_FIELD from '@salesforce/schema/Project__c.Status__c';
import PROJECT_TYPE from '@salesforce/schema/Project__c.Project_type__c';
import PRIORITY_FIELD from '@salesforce/schema/Project__c.Priority__c';
import saveObj from '@salesforce/apex/popup.popup';

export default class NewProjectPopup extends LightningElement {
  desc = "";
  name = "";
  owner ='';
    @track statusValues;
    @track projectTypeValues;
    @track priorityTypeValues;

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

  @wire(getPicklistValues, {
    recordTypeId: "012000000000000AAA",
    fieldApiName: STATUS_FIELD
  })
  status;

  @wire(getPicklistValues, {
    recordTypeId: "012000000000000AAA",
    fieldApiName: PRIORITY_FIELD
  })
  priority;

  @wire(getPicklistValues, {
    recordTypeId: "012000000000000AAA",
    fieldApiName: PROJECT_TYPE
  })
  project;

  formats = [
    "font",
    "size",
    "bold",
    "italic",
    "underline",
    "strike",
    "list",
    "indent",
    "align",
    "link",
    "image",
    "clean",
    "table",
    "header",
    "emoji"
  ];
  myval(event) {
    this.desc = event.target.value;
  }
  nameProject(event) {
    this.name = event.target.value;
  }
  handleChange(event) {
    this.valueStatus = event.detail.value;
  }
  ownerName(event) {
    this.owner = event.target.value;
  }

  handleEnddate(event) {
    this.Enddate = event.target.value;
  }

  handleChangeStatus(event) {
    this.statusValues = event.target.value;
  }
  handlechangeProject(event) {
    this.projectTypeValues = event.target.value;
  }
  handlechangePriority(event) {
    this.priorityTypeValues = event.target.value;
  }

  @api recordId;
  get acceptedFormats() {
      return ['.pdf', '.png','.jpg','.jpeg'];
  }
  handleUploadFinished(event) {
      
      const uploadedFiles = event.detail.files;
      let uploadedFileNames = '';
      for(let i = 0; i < uploadedFiles.length; i++) {
          uploadedFileNames += uploadedFiles[i].name + ', ';
      }
      this.dispatchEvent(
          new ShowToastEvent({
              title: 'Success',
              message: uploadedFiles.length + ' Files uploaded Successfully: ' + uploadedFileNames,
              variant: 'success',
          }),
      );
  }

  saveRecord(){
    let projectObj = {'sobjectType':'Project__c'};
    projectObj.Name=this.template.querySelector('lightning-input[name="projname"]').value;
    projectObj.Owner__c=this.template.querySelector('lightning-input[name="owner"]').value;
    projectObj.Finish_Date__c=this.template.querySelector('lightning-input[name="endDate"]').value;
    projectObj.Status__c=this.template.querySelector('lightning-combobox[name="status"]').value;
    projectObj.Priority__c=this.template.querySelector('lightning-input[name="priority"]').value;
    projectObj.Project_type__c=this.template.querySelector('lightning-input[name="projectType"]').value;
    projectObj.Description__c=this.template.querySelector('lightning-input-rich-text').value;
   

  saveObj({newRecord: projectObj})
      .then(result => {
          this.recordId = result;
      })
      .catch(error => {
          this.error = error;
      });
      this.submitDetails();
  }
}
