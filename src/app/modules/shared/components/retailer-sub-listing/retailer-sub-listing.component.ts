import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'app-retailer-sub-list',
    templateUrl: 'retailer-sub-listing.component.html',
    styleUrls: ['./retailer-sub-listing.component.css'],
    encapsulation: ViewEncapsulation.None,
})

export class RetailerSubListComponent implements OnInit, OnChanges {
    @Input() retailers: Array<any>;

    searchText: string;

    retailerDispList: Array<any>;

    @Output() retailerChanged: EventEmitter<any> = new EventEmitter();

    constructor() { }

    ngOnInit(): void { }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.retailers.currentValue) {
            this.retailerDispList = JSON.parse(JSON.stringify(this.retailers));
        }
    }

    searchByRetailer(): void {
        if (this.searchText) {
            this.retailerDispList = this.retailers.filter(ret => ret.retailer_name.toLowerCase().includes(this.searchText.toLowerCase()));
        } else {
            this.retailerDispList = JSON.parse(JSON.stringify(this.retailers));
        }
    }

    getOrderDetails(retailer: any): void {
        this.retailers = this.retailers.map(ret => {
            if (ret.isActive) {
                ret.isActive = false;
            }
            if (ret.id === retailer.id) {
                ret.isActive = true;
            }
            return ret;
        });
        this.retailerDispList = JSON.parse(JSON.stringify(this.retailers));
        this.retailerChanged.emit(retailer);
    }

}
