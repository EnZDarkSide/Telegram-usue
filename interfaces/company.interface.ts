export interface OrganizationSearchResponse {
    type: string;
    properties: Properties;
    features?: (FeaturesEntity)[] | null;
  }
  export interface Properties {
    ResponseMetaData: ResponseMetaData;
  }
  export interface ResponseMetaData {
    SearchResponse: SearchResponse;
    SearchRequest: SearchRequest;
  }
  export interface SearchResponse {
    found: number;
    display: string;
  }
  export interface SearchRequest {
    request: string;
    skip: number;
    results: number;
    boundedBy?: ((number)[] | null)[] | null;
  }
  export interface FeaturesEntity {
    type: string;
    geometry: Geometry;
    properties: Properties1;
  }
  export interface Geometry {
    type: string;
    coordinates: (number)[];
  }
  export interface Properties1 {
    name: string;
    description: string;
    boundedBy?: ((number)[] | null)[] | null;
    CompanyMetaData: CompanyMetaData;
  }
  export interface CompanyMetaData {
    id: string;
    name: string;
    address: string;
    url: string;
    Phones?: (PhonesEntity)[] | null;
    Categories: (CategoriesEntity)[];
    Hours?: Hours | null;
  }
  export interface PhonesEntity {
    type: string;
    formatted: string;
  }
  export interface CategoriesEntity {
    class: string;
    name: string;
  }
  export interface Hours {
    text: string;
    Availabilities?: (AvailabilitiesEntity)[] | null;
  }
  export interface AvailabilitiesEntity {
    Intervals?: (IntervalsEntity)[] | null;
    Monday?: boolean | null;
    Tuesday?: boolean | null;
    Wednesday?: boolean | null;
    Thursday?: boolean | null;
    Friday?: boolean | null;
  }
  export interface IntervalsEntity {
    from: string;
    to: string;
  }
  