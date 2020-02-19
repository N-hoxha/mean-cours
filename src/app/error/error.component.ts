import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.css']
})
export class ErrorComponent {

  // marim informaconin nga error-interceptor.ts dhe e percjellim ne ekaran

  constructor(@Inject(MAT_DIALOG_DATA) public data: {message: string}) {}

  // @Inject -> this allows you to then specify a special token and that will just be important for the dependency injection system Angular uses to identify this data you're passing around, this special way of injecting is required due to the special way this error component is getting created with.

  // MAT_DIALOG_DATA will hold data

}
