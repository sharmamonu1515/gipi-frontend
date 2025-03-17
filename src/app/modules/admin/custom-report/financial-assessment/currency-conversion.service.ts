import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CurrencyConversionService {
  private unitSubject = new BehaviorSubject<string>('INR');
  unit$ = this.unitSubject.asObservable();

  private readonly LAKH = 100000;
  private readonly CRORE = 10000000;

  setUnit(unit: string) {
    this.unitSubject.next(unit);
  }

  convertValue(value: number, unit: string): number {
    switch (unit) {
      case 'Lakhs':
        return value / this.LAKH;
      case 'Crores':
        return value / this.CRORE;
      case 'INR':
      default:
        return value;
    }
  }

  getCurrentUnit(): string {
    return this.unitSubject.value;
  }
}