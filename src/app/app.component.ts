import { Component, OnInit } from '@angular/core';
import { ColDef, IDatasource, IGetRowsParams, ISetFilterParams } from 'ag-grid-community';
import { ApiService } from './api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'datatable-example';


  private gridApi: any;
  private gridColumnApi: any;

  constructor(
    private apiSvc: ApiService
  ) { }

  ngOnInit(): void {
    // this.getData(5, 1);
  }

  async getData(pageSize: Number, pageNumber: number) {
    let resp = await this.apiSvc.getData(pageSize, pageNumber);
    console.log(resp);
  }

  columnDefs = [
    // add mini filter
    { field: 'nombre', sortable: false, filter: 'agSetColumnFilter',
    filterParams: {
        applyMiniFilterWhileTyping: true,
    } , flex: 1, minWidth: 100},
    { field: 'telefono', sortable: false, filter: true , flex: 1, minWidth: 100},
    { field: 'email', sortable: false, filter: true , flex: 1, minWidth: 100},
    { field: 'negocio', sortable: false, filter: true , flex: 1, minWidth: 100, valueGetter: this.getBusiness},
    // add actions edit and delete
    { 
      field: 'actions', 
      sortable: false, 
      filter: false , 
      flex: 1, 
      minWidth: 100,
      cellRenderer: function(params: any) {
        return `<button type="button" data-action-type="edit" class="btn btn-primary" >Edit</button>
                <button type="button" data-action-type="delete" class="btn btn-danger" (click)="onDelete($event)">Delete</button>`;
      },
      onCellClicked: (event: any) => {
        if (event.colDef.field === 'actions') {
          if (event.event.target.getAttribute('data-action-type') === 'edit') {
            this.onEdit(event);
          } else if (event.event.target.getAttribute('data-action-type') === 'delete') {
            this.onDelete(event);
          }
        }
      }
    }
  ];

  onEdit(event: any) {
    console.log(event);
    alert('edit');
  }

  onDelete(event: any) {
    console.log(event);
    alert('delete');
  }

  getBusiness(params:any) {
    if (params.data != null) {
      return params.data?.negocioAndRuta?.negocio;
    }
    return "";
  }

  public rowData = [];
  public rowModelType = 'infinite' as const;
  public defaultPageSize = 5;


  onGridReady(params: any) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.gridApi.setDatasource(this.dataSource);
  }

  dataSource: IDatasource = {
    getRows: async (params: IGetRowsParams) => {
      let resp = await this.apiSvc.getData(this.gridApi.paginationGetPageSize(), this.gridApi.paginationGetCurrentPage());
      let { data } = resp;
      console.log(data);
      params.successCallback(
        data.content, data.totalElements
      );
    }
  }

  onPageSizeChanged(event: any) {
    this.gridApi.paginationSetPageSize(Number(event.target.value));
  }

  public defaultColDef: ColDef = {
    flex: 1,
    minWidth: 200,
    resizable: true,
    floatingFilter: true,
  };

  
}

function replaceAccents(value: string) {
  return value
    .replace(new RegExp('[àáâãäå]', 'g'), 'a')
    .replace(new RegExp('æ', 'g'), 'ae')
    .replace(new RegExp('ç', 'g'), 'c')
    .replace(new RegExp('[èéêë]', 'g'), 'e')
    .replace(new RegExp('[ìíîï]', 'g'), 'i')
    .replace(new RegExp('ñ', 'g'), 'n')
    .replace(new RegExp('[òóôõøö]', 'g'), 'o')
    .replace(new RegExp('œ', 'g'), 'oe')
    .replace(new RegExp('[ùúûü]', 'g'), 'u')
    .replace(new RegExp('[ýÿ]', 'g'), 'y')
    .replace(new RegExp('\\W', 'g'), '');
}
const filterParams: ISetFilterParams = {
  textFormatter: replaceAccents,
};

