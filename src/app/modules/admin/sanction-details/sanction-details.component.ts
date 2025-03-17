import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import html2canvas from 'html2canvas';
import { DatePipe } from '@angular/common';
import { countries } from '../sanctions/countries';
@Component({
  selector: 'app-sanction-details',
  templateUrl: './sanction-details.component.html',
  styleUrls: ['./sanction-details.component.scss'],
  providers: [DatePipe]
})
export class SanctionDetailsComponent implements OnInit {
  @Input() row: any;
  @Input() searchText: any="All";
today=new Date();
  constructor(  public modal: NgbActiveModal,) { }

  ngOnInit(): void {
  }
  downloadModalAsImage(): void {
    const element = document.getElementById('sanction-detail');
    if (element) {
      html2canvas(element).then(canvas => {
        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/png');
        link.download = this.row.id+new Date().getTime();
        link.click();
      });
    }
  }
  getCountry(countryCode) {
    return countryCode.split(';').map(code => {
        const country = countries.find(c => c.code === code);
        return country ? `${country.value}(${code})` : `${code}`;
    }).join(';');
}

}
