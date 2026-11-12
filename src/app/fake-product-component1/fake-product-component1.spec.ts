import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { CommonModule } from '@angular/common';
import { FakeProductComponent1 } from './fake-product-component1';

describe('FakeProductComponent1', () => {
  let component: FakeProductComponent1;
  let fixture: ComponentFixture<FakeProductComponent1>;
  let httpTestingController: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FakeProductComponent1],
      imports: [CommonModule],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    })
      .compileComponents();

    httpTestingController = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(FakeProductComponent1);
    component = fixture.componentInstance;
    fixture.detectChanges();
    httpTestingController.expectOne('/products').flush([]);
    await fixture.whenStable();
  });

  afterEach(() => httpTestingController.verify());

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
