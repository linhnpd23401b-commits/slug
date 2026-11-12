import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { CustomerHttpService } from './customer-http-service';
import { ICustomerGroup } from '../classes/ICustomer';

describe('CustomerHttpService', () => {
  let service: CustomerHttpService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
    service = TestBed.inject(CustomerHttpService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('loads customer groups from the exercise JSON asset', () => {
    const groups: ICustomerGroup[] = [{ CustomerTypeId: 1, CustomerTypeName: 'VIP', Customers: [] }];
    let result: ICustomerGroup[] | undefined;
    service.getCustomers().subscribe(data => result = data);
    const request = http.expectOne('assets/data/customers.json');
    expect(request.request.method).toBe('GET');
    request.flush(groups);
    expect(result).toEqual(groups);
  });

  it('retries three times and reports a missing JSON file', () => {
    let failure: Error | undefined;
    service.getCustomers().subscribe({ error: error => failure = error });
    for (let attempt = 0; attempt < 4; attempt++) {
      http.expectOne('assets/data/customers.json').flush('Missing', { status: 404, statusText: 'Not Found' });
    }
    expect(failure?.message).toContain('Không thể tải danh sách khách hàng');
    expect(failure?.message).toContain('404');
  });
});
