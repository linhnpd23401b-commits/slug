import { Component, OnInit, signal } from '@angular/core';
import { ICustomerGroup } from '../classes/ICustomer';
import { CustomerHttpService } from '../services/customer-http-service';

@Component({
  selector: 'app-group-customers-component',
  standalone: false,
  templateUrl: './group-customers-component.html',
  styleUrl: './group-customers-component.css',
})
export class GroupCustomersComponent implements OnInit {
  groups = signal<ICustomerGroup[]>([]);
  errMessage = signal('');
  loading = signal(false);

  constructor(private service: CustomerHttpService) {}

  ngOnInit(): void {
    this.loadCustomers();
  }

  loadCustomers(): void {
    this.loading.set(true);
    this.errMessage.set('');
    this.service.getCustomers().subscribe({
      next: data => {
        this.groups.set(data);
        this.loading.set(false);
      },
      error: (error: Error) => {
        this.errMessage.set(error.message);
        this.loading.set(false);
      },
    });
  }
}
