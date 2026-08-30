export interface IHeadersType {
  'x-consumer-correlationId': string;
  'x-consumer-userId': string;
  'x-consumer-timestamp': string;
  'x-consumer-system': string;
  'x-consumer-page-number'?: string;
  'x-consumer-page-size'?: string;
  'Authorization'?: string;
  'Content-Type'?: string;
  'operation'?: string;
}
