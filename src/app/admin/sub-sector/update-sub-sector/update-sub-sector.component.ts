import { Component, OnInit } from '@angular/core';
import { UtilsService } from './../../../services/utils.service';
import { Subscription } from 'rxjs/Subscription';
import { ActivatedRoute } from '@angular/router';
import { SubSectorModel  } from './../../../models/sub-sector.model';
import { SubsectorsService } from '../../../services/subsectors.service';
@Component({
  selector: 'app-update-sub-sector',
  templateUrl: './update-sub-sector.component.html',
  styleUrls: ['./update-sub-sector.component.css']
})
export class UpdateSubSectorComponent implements OnInit {

  public loading: boolean;
  public subsector: SubSectorModel;
  routeSub: Subscription;
  private id: number;
  public subSectorSub: Subscription;
  public error: boolean;
  constructor( 
    private route: ActivatedRoute,    
    private _subSectorapi: SubsectorsService,
    public utils: UtilsService) { }

  ngOnInit() {
   
    // Set event ID from route params and subscribe
    this.routeSub = this.route.params
      .subscribe(params => {
        this.id = params['id'];
        this._getSubSector();
      });
  }
  private _getSubSector() {
    this.loading = true;
    // GET event by ID
    this.subSectorSub = this._subSectorapi
      .getSubSectorById$(this.id)
      .subscribe(
        res => {
          if(res.success){
            this.subsector = res.data;         
          }          
          this.loading = false;
        },
        err => {
          this.loading = false;
          this.error = true;
        }
      );
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
    this.subSectorSub.unsubscribe();
  }

}
