import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { Observable, from } from 'rxjs';

import { catchError } from 'rxjs/operators';
import { CompanyType } from '../models/company-type.enum';

@Injectable()
export class ApiHelperService {
  tapBaseUrl = 'https://booking.flytap.com/';

  constructor(private http: HttpClient) {}

  private GetHttpHeaders(bearToken?: string): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${bearToken}`,
    });
  }

  resolveUrl(companyType: CompanyType, path: string): string {
    switch (companyType) {
      case CompanyType.Tap:
        return `${this.tapBaseUrl}${path}`;
      default:
        throw new Error('Company type not implemented');
    }
  }

  private formatErrors(error: any) {
    return from(error);
  }

  get(
    path: string,
    params: HttpParams = new HttpParams(),
    companyType: CompanyType
  ): Observable<any> {
    return this.http
      .get(this.resolveUrl(companyType, path), {
        headers: this.GetHttpHeaders(),
        params,
      })
      .pipe(catchError(this.formatErrors));
  }

  put(
    path: string,
    body: Object = {},
    companyType: CompanyType
  ): Observable<any> {
    return this.http
      .put(this.resolveUrl(companyType, path), JSON.stringify(body), {
        headers: this.GetHttpHeaders(),
      })
      .pipe(catchError(this.formatErrors));
  }

  post(
    path: string,
    body: Object = {},
    params: HttpParams = new HttpParams(),
    companyType: CompanyType,
    bearToken?: string
  ): Observable<any> {
    return this.http
      .post(this.resolveUrl(companyType, path), JSON.stringify(body), {
        headers: this.GetHttpHeaders(bearToken),
        params: params,
      })
      .pipe(catchError(this.formatErrors));
  }

  delete(path: string, companyType: CompanyType): Observable<any> {
    return this.http
      .delete(this.resolveUrl(companyType, path), {
        headers: this.GetHttpHeaders(),
      })
      .pipe(catchError(this.formatErrors));
  }
}
