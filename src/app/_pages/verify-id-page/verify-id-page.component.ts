import { Component, OnDestroy, inject } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { LangValidator } from '@app/_helpers/lang.validators';
import { FlowType } from '@app/_models/flow-type.enum';
import { HeaderSize } from '@app/_models/header-size.enum';
import { GKeybLanGlobal as G } from '@app/_globals';
import { RegisterService } from '@app/_services/register.service';
import { BikeboxResponse, ResponseCode } from '@app/_models/response.model';
import { UntilDestroy } from '@ngneat/until-destroy';
import { take } from 'rxjs';

@UntilDestroy()
@Component({
  selector: 'app-verify-id-page',
  templateUrl: './verify-id-page.component.html',
  styleUrls: ['./verify-id-page.component.scss'],
})
export class VerifyIdPageComponent implements OnDestroy {
  private readonly registerService = inject(RegisterService);
  private readonly router = inject(Router);

  form!: FormGroup;
  flowType = FlowType.paymentMethod;
  headerSize = HeaderSize.big;
  apiStatusCode = '';

  get f() {
    return this.form.controls;
  }

  ngOnInit(): void {
    G.setVisibleKeybToggle(true);
    G.KeyboardVisible = true;
    this.intializeForm();
  }
  intializeForm() {
    this.form = new FormGroup({
      phone: new FormControl<string>('', [
        LangValidator.required('phone'),
        LangValidator.number('phone', 7, 12),
      ]),
    });
  }

  getClasses(cname: string) {
    const fc = this.f[cname] as FormControl;

    const c = {
      'is-invalid': !!fc?.touched && !fc?.valid,
      'is-valid': !!fc?.valid,
    };
    return c;
  }

  verifyId() {
    this.apiStatusCode = '';
    const { value, valid } = this.form;

    if (!valid) {
      return;
    }

    this.registerService
      .verifyById(value)
      .pipe(take(1))
      .subscribe((res: BikeboxResponse) => {
        if (res.code === ResponseCode.Success) {
          this.registerService.verificationData = {
            userId: res.user_id,
            phone: value.phone,
          };
          this.router.navigate(['payment-method/enter-sms'], {
            state: { value },
          });
        } else {
          this.apiStatusCode = res.code.toString();
        }
      });
  }

  ngOnDestroy(): void {
    G.KeyboardVisible = false;
  }
}