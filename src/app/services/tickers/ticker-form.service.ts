

import { Injectable } from '@angular/core';
@Injectable()
export class TickerFormService {

  validationMessages: any;
  // Set up errors object
  formErrors = {
    name: '',
    company: '',
    industry: '',
    sector: '',
    company_url: '',
    country: '',
    listing_exchange: '',
    currency: '',
    market_cap: '',
    share_in_issue: '',
    fiftytwo_week_high: '',
    fiftytwo_week_low: '',
    avg_volume: '',
    about: ''
  };

  constructor() {
    this.validationMessages = {
      name: {
        required: `Name is <strong>required</strong>.`
      },
      company: {
        required: `Company is <strong>required</strong>.`
      },
      industry: {
        required: `Industry is <strong>required</strong>.`
      },
      sector: {
        required: `Sector Number is <strong>required</strong>.`
      },
      company_url: {
        required: `Company Url is <strong>required</strong>.`
      },
      listing_exchange: {
        required: `listing_exchange is <strong>required</strong>.`
      },
      country: {
        required: `Country is <strong>required</strong>.`
      },
      market_cap: {
        required: `market_cap is <strong>required</strong>.`,
        pattern: 'Only Numbers Allowed'
      },
      share_in_issue: {
        required: `share_in_issue is <strong>required</strong>.`,
        pattern: 'Only Numbers Allowed'
      },
      fiftytwo_week_high: {
        pattern: 'Only Numbers Allowed'
      },
      fiftytwo_week_low: {
        pattern: 'Only Numbers Allowed'
      },
      avg_volume: {
        pattern: 'Only Numbers Allowed'
      },
      about: {
        required: `About is <strong>required</strong>`
      }
    };
  }

}
