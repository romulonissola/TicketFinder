export class TapGetTicketPricesSegment {
  idInfoSegment!: number;
  departureAirport!: string;
  departureTimezone!: string | null;
  arrivalAirport!: string;
  departureDate!: string;
  arrivalDate!: string;
  carrier!: string;
  flightNumber!: string;
  operationCarrier!: string;
  equipment!: string;
  duration!: number;
  stopTime!: number;
  departureTerminal!: string;
  arrivalTerminal!: string;
  status!: string[];
  operationalDisclosure: any;
  cabinMeal: any;
  flightFlown!: boolean;
  fareFamily: any;
  technicalStops: any;
  longLayover!: boolean;
  airportChange!: boolean;
  haul!: string;
  baggageForPax: any;
  notAvailable!: boolean;
  directFlightGovAlert!: boolean;
}

export class TapGetTicketPricesOffer {
  idOffer!: number;
  outFareFamily!: string;
  inFareFamily!: string;
  outCommercialFareFamily: any;
  inCommercialFareFamily: any;
  outFareFamilyHierarchy: any;
  inFareFamilyHierarchy: any;
  outCabin!: string;
  inCabin!: string;
  groupFlights!: {
    idOutBound: number;
    idInBound: number;
    seatOutBound: number;
    seatInBound: number;
    lastSeatOutBound: boolean;
    lastSeatInBound: boolean;
    milesGoDiscount: boolean;
  }[];
  timeToThink: any;
  minPeriod: any;
  earnedPoints: any;
  totalPrice!: {
    price: number;
    basePrice: number;
    tax: number;
    minFareInPoints: number;
    superSaver: boolean;
    obFee: number;
    sliderDiscount: number;
    miles: number;
    ccFee: number;
  };
  totalPoints: any;
  listPaxPrice!: {
    price: number;
    basePrice: number;
    tax: number;
    typePax: string;
    minFareInPoints: number;
    superSaver: boolean;
    obFee: number;
    sliderDiscount: number;
    miles: number;
    ccFee: number;
  }[];
  listPaxPoints: any;
  outbound: any;
  inbound: any;
  responseId: any;
  discountedWithPromocode!: boolean;
}

export class TapGetTicketPricesTab {
  date!: string;
  returnDate!: string | null;
  available!: string;
  totalPrice!: {
    price: number;
    basePrice: number;
    tax: number;
    typePax: string;
    minFareInPoints: number;
    superSaver: boolean;
    obFee: number;
    sliderDiscount: number;
    miles: number;
    ccFee: number;
  } | null;
  totalPoints: any;
  outBoundPrice: any;
  outBoundPoints: any;
  inBoundPrice: any;
  inBoundPoints: any;
}

export class Tapbound {
  idFlight!: number;
  duration!: number;
  numberOfStops!: number;
  relateOffer!: number[];
  listSegment!: TapGetTicketPricesSegment[];
  airportChange!: boolean;
  embargoWarning!: boolean;
  embargoStartDate: any;
  embargoEndDate: any;
  milesGoDiscount!: boolean;
}

export class TapGetTicketPricesData {
  listPaxNum!: {
    paxNum: number;
    paxType: string;
  }[];
  listOutbound!: Tapbound[];
  listInbound!: Tapbound[];
  offers!: {
    currency: string;
    points: any;
    listOffers: TapGetTicketPricesOffer[];
  };
  outPanel!: {
    currency: string;
    points: any;
    listTab: TapGetTicketPricesTab[];
  };
  inPanel!: {
    currency: string;
    points: any;
    listTab: TapGetTicketPricesTab[];
  };
  matrixPanel: any;
  offerMatrix!: {
    currency: string;
    points: any;
    listTab: TapGetTicketPricesTab[];
  };
  cff: any;
  officeId!: string;
  hitAvail!: boolean;
  hitCalendar!: boolean;
  totalAvailHits!: number;
  totalCalendarHits!: number;
  gdsSession: any;
  availabilityId: any;
  premium!: boolean;
  notAvailable!: boolean;
}

export class TapGetTicketPricesResponse {
  status!: string;
  errors!: {
    code: string;
    type: string;
    desc: string;
  }[];
  data!: TapGetTicketPricesData | null;
}
