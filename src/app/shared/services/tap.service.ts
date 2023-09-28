import { Injectable } from '@angular/core';
import { Observable, catchError, map, of, take } from 'rxjs';
import { ApiHelperService } from './api-helper.service';
import { CompanyType } from '../models/company-type.enum';
import { Airport } from '../models/airport.model';
import {
  TapGetTicketPricesData,
  TapGetTicketPricesResponse,
} from '../models/tap-get-ticket-prices.model';
import { formatToTapDate } from '../helpers/helper-functions';

@Injectable()
export class TapService {
  bearToken = '';

  constructor(private apiHelperService: ApiHelperService) {}

  createToken(market: string = 'GB'): Observable<string> {
    const requestUrl = 'bfm/rest/session/create';
    const body = {
      clientId: '-bqBinBiHz4Yg+87BN+PU3TaXUWyRrn1T/iV/LjxgeSA=',
      clientSecret:
        'DxKLkFeWzANc4JSIIarjoPSr6M+cXv1rcqWry2QV2Azr5EutGYR/oJ79IT3fMR+qM5H/RArvIPtyquvjHebM1Q==',
      referralId: 'h7g+cmbKWJ3XmZajrMhyUpp9.cms35',
      market,
      language: 'en',
      userProfile: null,
      appModule: '0',
    };
    return this.apiHelperService
      .post(requestUrl, body, undefined, CompanyType.Tap)
      .pipe(
        map((token: { id: string }) => {
          this.bearToken = token.id;
          return this.bearToken;
        })
      );
  }

  getTicketPrices(
    startDate: Date,
    endDate: Date,
    market: string,
    origin: string,
    destination: string,
    oneWay: boolean
  ): Observable<{
    startDate: Date;
    endDate: Date;
    response: TapGetTicketPricesResponse;
  }> {
    const requestUrl = 'bfm/rest/booking/availability/search/';
    const departureDate = formatToTapDate(startDate);
    const returnDate = formatToTapDate(endDate);
    const body = {
      adt: 1,
      airlineId: 'TP',
      bfmModule: 'BFM_BOOKING',
      c14: 0,
      cabinClass: 'E',
      changeReturn: false,
      channelDetectionName: '',
      chd: 0,
      cmsId: 'string',
      communities: [],
      departureDate: [departureDate],
      destination: [destination],
      groups: [],
      inf: 0,
      language: 'en',
      market,
      multiCityTripType: false,
      numSeat: 1,
      numSeats: 1,
      oneWay,
      origin: [origin],
      passengers: {
        ADT: 1,
        YTH: 0,
        CHD: 0,
        INF: 0,
      },
      paxSearch: {
        ADT: 1,
        YTH: 0,
        CHD: 0,
        INF: 0,
      },
      permittedCabins: [],
      preferredCarrier: [],
      promocode: '',
      promotionId: '',
      returnDate,
      roundTripType: true,
      searchPoint: true,
      session: 'string',
      tripType: 'R',
      validTripType: true,
      student: false,
      resident: false,
      yth: 0,
    };

    return this.apiHelperService
      .post(requestUrl, body, undefined, CompanyType.Tap, this.bearToken)
      .pipe(
        map((response) => {
          return { startDate, endDate, response };
        })
      );
  }

  getOriginAirports(): Observable<{
    data: {
      origins: Airport[];
      translateAirport: { [key: string]: string };
      translateCity: { [key: string]: string };
      translateCountry: { [key: string]: string };
    };
  }> {
    const requestUrl = 'bfm/rest/journey/origin/search';
    const body = {
      tripType: 'R',
      market: 'GB',
      language: 'en',
      airlineIds: ['TP'],
      payWithMiles: false,
    };
    return this.apiHelperService.post(
      requestUrl,
      body,
      undefined,
      CompanyType.Tap
    );
  }

  getDestinationAirports(origin: string): Observable<{
    data: {
      destinations: Airport[];
      translateAirport: { [key: string]: string };
      translateCity: { [key: string]: string };
      translateCountry: { [key: string]: string };
    };
  }> {
    const requestUrl = 'bfm/rest/journey/destination/search';
    const body = {
      tripType: 'R',
      market: 'GB',
      language: 'en',
      airlineIds: ['TP'],
      payWithMiles: false,
      origin,
    };
    return this.apiHelperService.post(
      requestUrl,
      body,
      undefined,
      CompanyType.Tap
    );
  }

  // get(id: string): Observable<any> {
  //   return this.apiHelperService.get(this.getUrl(id), null, CompanyType.Tap);
  // }

  // add(asset: Asset): Observable<Asset> {
  //   return this.apiHelperService.post(
  //     this.serviceURL,
  //     asset,
  //     null,
  //     CompanyType.Tap
  //   );
  // }
}
