import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { Observable, Subscription, map, of, startWith, take } from 'rxjs';
import {
  compare,
  formatToTapDate,
  sleep,
} from 'src/app/shared/helpers/helper-functions';
import { Airport } from 'src/app/shared/models/airport.model';
import { TapGetTicketPricesTab } from 'src/app/shared/models/tap-get-ticket-prices.model';
import { TapService } from 'src/app/shared/services/tap.service';

@Component({
  selector: 'app-tap',
  templateUrl: './tap.component.html',
  styleUrls: ['./tap.component.scss'],
})
export class TapComponent implements OnInit {
  originAirports: Airport[] = [];
  destinationAirports: Airport[] = [];
  originFilteredOptions: Observable<Airport[]> = of([]);
  destinationFilteredOptions: Observable<Airport[]> = of([]);
  outPanelPrices: TapGetTicketPricesTab[] = [];
  inPanelPrices: TapGetTicketPricesTab[] = [];
  searchForm: FormGroup;
  errors: string[] = [];
  originDefault = 'LON';
  destinationDefault = 'POA';
  marketCode = 'GBP';
  currentCurrencyOut = '';
  currentCurrencyIn = '';

  displayedColumnsOut = ['date', 'price'];
  displayedColumnsIn = ['date', 'price'];

  translateAirport!: { [key: string]: string } | null;
  translateCity!: { [key: string]: string } | null;
  translateCountry!: { [key: string]: string } | null;

  @ViewChild('tableOut') tableOut!: MatTable<any>;
  @ViewChild('tableIn') tableIn!: MatTable<any>;
  @ViewChild('tableOut') sortOut!: MatSort;
  @ViewChild('tableIn') sortIn!: MatSort;
  loading = 0;

  get oneWay(): boolean {
    return this.searchForm.controls['oneWay'].value;
  }

  constructor(private fb: FormBuilder, private tapService: TapService) {
    this.searchForm = this.fb.group({
      origin: [''],
      destination: [''],
      tripType: ['R'],
      paxType: ['ADT'],
      start: null,
      end: null,
      oneWay: false,
    });
  }

  ngOnInit(): void {
    this.tapService
      .getOriginAirports()
      .pipe(take(1))
      .subscribe((data) => {
        this.originAirports = data.data.origins;
        this.translateAirport = data.data.translateAirport;
        this.translateCity = data.data.translateCity;
        this.translateCountry = data.data.translateCountry;
        const airport = this.originAirports.find(
          (a) => a.airport === this.originDefault
        );
        if (airport) {
          this.searchForm.controls['origin'].setValue(airport);
          this.loadDestinationAirports(this.destinationDefault);
        }
      });

    this.originFilteredOptions = this.searchForm.controls[
      'origin'
    ].valueChanges.pipe(
      startWith(''),
      map((value) => {
        const airport = typeof value === 'string' ? value : value?.airport;
        return airport
          ? this._filter(airport as string)
          : this.originAirports.slice();
      })
    );

    this.destinationFilteredOptions = this.searchForm.controls[
      'destination'
    ].valueChanges.pipe(
      startWith(''),
      map((value) => {
        const airport = typeof value === 'string' ? value : value?.airport;
        return airport
          ? this._filter(airport as string)
          : this.destinationAirports.slice();
      })
    );
  }

  displayFn(airport: Airport): string {
    if (
      !this.translateAirport ||
      !this.translateCity ||
      !this.translateCountry
    ) {
      return '';
    }
    return airport
      ? `${airport.airport} - ${this.translateCity[airport.city!]} - ${
          this.translateCountry[airport.country!]
        }`
      : '';
  }

  private _filter(name: string): Airport[] {
    const filterValue = name.toLowerCase();

    return this.originAirports.filter((option) => {
      return (
        option.airport!.toLowerCase().includes(filterValue) ||
        option.city!.toLowerCase().includes(filterValue) ||
        option.country!.toLowerCase().includes(filterValue) ||
        (this.translateAirport &&
          this.translateAirport[option.airport!]
            .toLowerCase()
            .includes(filterValue)) ||
        (this.translateCity &&
          this.translateCity[option.city!]
            .toLowerCase()
            .includes(filterValue)) ||
        (this.translateCountry &&
          this.translateCountry[option.country!]
            .toLowerCase()
            .includes(filterValue))
      );
    });
  }

  loadDestinationAirports(defaultValue?: string): void {
    this.tapService
      .getDestinationAirports(this.searchForm.controls['origin'].value.airport)
      .pipe(take(1))
      .subscribe((data) => {
        this.destinationAirports = data.data.destinations;
        if (defaultValue) {
          const destination = this.destinationAirports.find(
            (a) => a.airport === defaultValue
          );
          if (destination) {
            this.searchForm.controls['destination'].setValue(destination);
          }
        }
      });
  }

  search() {
    this.tapService
      .createToken(this.marketCode)
      .pipe(take(1))
      .subscribe(() => this.findBestPrices());
  }

  async findBestPrices() {
    this.outPanelPrices = [];
    this.inPanelPrices = [];
    this.errors = [];
    const originalStartDate = this.searchForm.controls['start'].value;
    const originalEndDate = this.searchForm.controls['end'].value;

    let startDate = new Date();
    for (let index = 0; startDate < originalEndDate; index++) {
      startDate = this.addDays(originalStartDate, index);
      const endDate = this.addDays(startDate, 7);
      console.table({ date: new Date(), startDate, endDate });
      this.loading++;
      this.tapService
        .getTicketPrices(
          startDate,
          endDate,
          this.marketCode,
          this.searchForm.controls['origin'].value.airport,
          this.searchForm.controls['destination'].value.airport,
          this.searchForm.controls['oneWay'].value
        )
        .pipe(take(1))
        .subscribe((response) => {
          if (response.response.status === '200') {
            this.currentCurrencyOut = response.response.data!.outPanel.currency;
            const outPanelprice = response.response.data!.outPanel.listTab.find(
              (l) => l.date === formatToTapDate(response.startDate)
            );
            if (outPanelprice) {
              this.outPanelPrices.push(outPanelprice);
            }
            this.currentCurrencyIn = response.response.data!.inPanel.currency;
            const inPanelprice = response.response.data!.inPanel.listTab.find(
              (l) => l.date === formatToTapDate(response.endDate)
            );
            if (inPanelprice) {
              this.inPanelPrices.push(inPanelprice);
            }
            this.tableIn?.renderRows();
            this.sortInChange({ active: 'price', direction: 'asc' });
            this.tableOut?.renderRows();
            this.sortOutChange({ active: 'price', direction: 'asc' });
          } else {
            this.errors.push(...response.response.errors.map((a) => a.desc));
          }
          this.loading--;
        });
      await sleep(1000);
    }
  }

  objToString(obj: any): string {
    if (obj) {
      return JSON.stringify(obj);
    }
    return '';
  }

  addDays(date: Date, daysToAdd: number): Date {
    const newDate = new Date(date);
    newDate.setDate(date.getDate() + daysToAdd);
    return newDate;
  }

  orderByCheaperPrice(
    ticketPrices: TapGetTicketPricesTab[]
  ): TapGetTicketPricesTab[] {
    return ticketPrices.sort(
      (t1, t2) => (t1.totalPrice?.price ?? 0) - (t2.totalPrice?.price ?? 0)
    );
  }

  sortOutChange(sortState: Sort) {
    this.outPanelPrices = this.sortTable(this.outPanelPrices, sortState);
  }

  sortTable(
    gridData: TapGetTicketPricesTab[],
    sortState: Sort
  ): TapGetTicketPricesTab[] {
    const data = gridData.slice();
    if (!sortState.active || sortState.direction === '') {
      return data;
    }

    return data.sort((a, b) => {
      const isAsc = sortState.direction === 'asc';
      switch (sortState.active) {
        case 'date':
          return compare(a.date, b.date, isAsc);
        case 'price':
          return compare(
            a.totalPrice?.price ?? 0,
            b.totalPrice?.price ?? 0,
            isAsc
          );
        default:
          return 0;
      }
    });
  }

  sortInChange(sortState: Sort) {
    this.inPanelPrices = this.sortTable(this.inPanelPrices, sortState);
  }
}
