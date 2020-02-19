import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth/auth.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

// Now we just need to run that method and a great place to run this is in the app component. There, we know that this component gets loaded first, when our application is starting up, this component gets loaded, so this is a great place to actually do our basic initializations.

export class AppComponent implements OnInit {

  constructor(private authService: AuthService ) {}

  ngOnInit(){

     this.authService.autoAuthUser(); // nese nuk e shkrujme kete atere kur jena brenda application dhe i japim refresh na shfaqet application ne fillim te tij, duhet me u bere perseri login qe te futesh ne application. kurse me kete nuk na shfaqet ky problem.

  }

}


// SHenim: kena ber disa ndryshime ne file tslint.json, per arsyse se pse angulari qe kena nuk na lejonte qe te benim komente, na i tregonte si eror te vogla prandaj ndyshuma shimet te cilat ishin:
// {
//   "extends": "../tslint.json",
//   "rules": {
//       "directive-selector": [
//           true,
//           "attribute",
//           "app",
//           "camelCase"
//       ],
//       "component-selector": [
//           true,
//           "element",
//           "app",
//           "kebab-case"
//       ],
//       "max-line-length": [ false ],
//   }
// }
// ku ne me pas e ndyshum ne:
// {
//   "extends": "../tslint.json",
//   "rules": {
//     "max-line-length": [
//       true,
//       {
//         "limit": 120,
//         "ignore-pattern": "^import [^,]+ from |^export | implements"
//       }
//     ],
//       "directive-selector": [
//           true,
//           "attribute",
//           "app",
//           "camelCase"
//       ],
//       "component-selector": [
//           true,
//           "element",
//           "app",
//           "kebab-case"
//       ],
//       "max-line-length": [ false ]
//   }

