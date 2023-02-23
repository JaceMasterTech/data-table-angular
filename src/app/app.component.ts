import { Component, OnInit } from '@angular/core';
import { IDatasource, IGetRowsParams } from 'ag-grid-community';
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

  async getData(pageSize: Number, pageNumber: Number) {
    let resp = await this.apiSvc.getData(pageSize, pageNumber);
    console.log(resp);
  }

  columnDefs = [
    { field: 'nombre', sortable: true, filter: true , flex: 1, minWidth: 100},
    { field: 'telefono', sortable: true, filter: true , flex: 1, minWidth: 100},
    { field: 'email', sortable: true, filter: true , flex: 1, minWidth: 100},
    { field: 'negocio', sortable: true, filter: true , flex: 1, minWidth: 100, valueGetter: this.getBusiness},
  ];

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


	// columnDefs = [
	// 	{headerName: 'Make', field: 'make' },
	// 	{headerName: 'Model', field: 'model' },
	// 	{headerName: 'Price', field: 'price'}
	// ];

	// rowData = [
	// 	{ make: 'Toyota', model: 'Celica', price: 35000 },
	// 	{ make: 'Ford', model: 'Mondeo', price: 32000 },
	// 	{ make: 'Porsche', model: 'Boxster', price: 72000 }
	// ];

}

