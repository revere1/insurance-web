import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { ComposeService } from '../../../services/compose.service';
import { InsightService } from '../../../services/insights/insight.service';
import { ToastsManager } from 'ng2-toastr';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-choose-type',
  templateUrl: './choose-type.component.html',
  styleUrls: ['./choose-type.component.css']
})
export class ChooseTypeComponent implements OnInit {

  private routeSub: Subscription;
  private formData: any;
  public selectValue: any;
  public id: number;

  constructor(
    private _router: Router,
    private _route: ActivatedRoute,
    private _composeapi: ComposeService,
    private _insightApi: InsightService,
    private _toastr: ToastsManager,
    private _formBuilder: FormBuilder) { }

  ngOnInit() {
    this.routeSub = this._route.params
      .subscribe(params => {
        this.id = params['id']
      });
  }

  private pickTickerForm: FormGroup = this._formBuilder.group({
  });

  public chooseMe(type) {
    this.selectValue = type;
  }

  public countinue(type) {
    if (this.id != undefined) {
      let formData = this.pickTickerForm.value;
      if (type == 'macro-type') {
        formData.tickerId = null;
        formData.commodityId = null;
      }
      formData.type = type;
      this._insightApi.editEvent$(this.id, formData)
        .subscribe(data => {
          if (data.success) {
            this._toastr.success(data.message, 'Success');
            if (type !== 'macro-type') {
              this._router.navigateByUrl(`/analyst/insights/compose/pick-ticker/${type}/` + this.id);
            } else {
              this._router.navigateByUrl(`/analyst/insights/compose/pick-ticker/${type}/` + this.id);
            }
          }
          else {
            this._toastr.error(data.message, 'error');
          }
        });
    } else {
      this._router.navigateByUrl(`/analyst/insights/compose/pick-ticker/${type}`);
    }
  }

}
