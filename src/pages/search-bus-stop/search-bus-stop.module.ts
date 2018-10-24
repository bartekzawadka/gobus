import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SearchBusStopPage } from './search-bus-stop';

@NgModule({
  declarations: [
    SearchBusStopPage,
  ],
  imports: [
    IonicPageModule.forChild(SearchBusStopPage),
  ],
})
export class SearchBusStopPageModule {}
