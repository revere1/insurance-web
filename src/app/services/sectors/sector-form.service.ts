import { Injectable } from '@angular/core';

@Injectable()
export class SectorFormService {

  validationMessages: any;
  // Set up errors object
  formErrors = {
    name: '',
    status: '',
    createdBy: '',
    updatedBy: ''
  };

  constructor() {
    this.validationMessages = {
      name: {
        required: `Sector Name is <strong>required</strong>.`
      },
      status: {
        required: `Status is <strong>required</strong>.`
      }
    };
  }

}
