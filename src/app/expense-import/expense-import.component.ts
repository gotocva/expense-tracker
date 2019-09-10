import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Papa, PapaParseConfig } from 'ngx-papaparse';
import { MatSnackBar } from '@angular/material';
import { ExpenseImportModel, requiredColumns } from './expense-import.model';

@Component({
  selector: 'app-expense-import',
  templateUrl: './expense-import.component.html',
  styleUrls: ['./expense-import.component.scss']
})
export class ExpenseImportComponent implements OnInit {

  @Input() disabled: boolean;
  @Output() dataExported: EventEmitter<ExpenseImportModel[]> = new EventEmitter();

  constructor(private papa: Papa,
              private snackBar: MatSnackBar) {
  }

  ngOnInit() {
  }

  fileChangeListener($event): void {
    const files = $event.srcElement.files[0];
    console.log(files);

    const options = <PapaParseConfig>{
      complete: (results, file) => {

        if (results.data.length > 0) {
          if (requiredColumns.every(x => results.meta.fields.includes(x))) {
            console.log('all found');
            this.dataExported.emit(results.data);
          } else {
            this.snackBar.open(`Error when processing csv file. Missing columns ${requiredColumns.filter(x => !results.meta.fields.includes(x))}`, null, {duration: 3000});
          }
        } else {
          this.snackBar.open('No data found! Please check csv file and try again.', null, {duration: 3000});
        }
      },
      header: true, skipEmptyLines: true
    };
    this.papa.parse(files, options);
  }

}
