import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-ds-report',
    templateUrl: './dsr.component.html',
    styleUrls: ['./dsr.component.css']
})

export class DSReportComponent implements OnInit {

    dtOptions: DataTables.Settings = {};

    constructor() {
        this.dtOptions = {
            pagingType: 'simple_numbers'
        };
    }

    ngOnInit(): void { }

}
