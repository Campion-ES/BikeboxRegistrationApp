﻿import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { GKeybLanGlobal as G } from '@app/_globals';
import { LangValidator } from '@app/_helpers/lang.validators';
import { take } from 'rxjs';
import { Router } from '@angular/router';
import { FlowType } from '@app/_models/flow-type.enum';
import { HeaderSize } from '@app/_models/header-size.enum';
import { RegisterService } from '@app/_services/register.service';
import { BikeboxResponse } from '@app/_models/response.model';

const REQUIRED_FIELDS_STATUS_CODE = 100000;

@Component({
  selector: 'register-form',
  templateUrl: 'register-page.component.html',
  styleUrls: ['register-page.component.scss'],
})
export class RegisterPageComponent implements OnInit, OnDestroy {
  private readonly registerService = inject(RegisterService);
  private readonly router = inject(Router);

  form!: FormGroup;
  loading = false;
  submitted = false;

  flowType = FlowType.register;
  headerSize = HeaderSize.small;
  apiStatusCode = '';

  get f() {
    return this.form.controls;
  }

  ngOnInit() {
    G.setVisibleKeybToggle(true);
    G.KeyboardVisible = true;
    this._createRegisterForm();
  }

  private _createRegisterForm() {
    this.form = new FormGroup({
      firstName: new FormControl<string>('', [
        LangValidator.required('firstName'),
      ]),
      lastName: new FormControl<string>('', [
        LangValidator.required('lastName'),
      ]),
      passport: new FormControl('', [
        LangValidator.required('passport'),
        LangValidator.teudatZehut('passport'),
      ]),
      email: new FormControl('', [
        LangValidator.required('email'),
        LangValidator.email('email'),
      ]),
      phone: new FormControl<string>('', [
        LangValidator.required('phone'),
        LangValidator.number('phone', 7, 12),
      ]),
      address: new FormControl<string>('',[]),
      ravkav: new FormControl<string>('', []),

      imagreeTerms: new FormControl<boolean>(false, [
        LangValidator.requiredTrue('imagreeTerms'),
      ]),
      imagreePolicy: new FormControl<boolean>(false, [
        LangValidator.requiredTrue('imagreePolicy'),
      ]),
    });
  }

  OnSliderChange(evt: any, ctrlName: string) {
    const c = this.f[ctrlName] as FormControl;
    c.markAsTouched({ onlySelf: true });
    const checked = !!evt?.target?.checked;
    if (c.value != checked) {
      c.setValue(checked);
    }
    console.log(`OnSliderChange:(${ctrlName})=${c.value}`);
  }

  private _validateMe() {
    if (this.form) {
      this.form.markAllAsTouched();

      for (let controlName in this.form?.controls) {
        const c = this.f[controlName] as FormControl;
        if (c) {
          c.markAsTouched();
          c.updateValueAndValidity();
        }
      }
    }
  }

  getClasses(cname: string) {
    const fc = this.f[cname] as FormControl;

    const c = {
      'is-invalid': !!fc?.touched && !!fc?.errors,
      'is-valid': !!fc?.valid,
    };
    return c;
  }

  async onSubmit() {
    this.apiStatusCode = '';
    const { valid, value } = this.form;

    if (!valid) {
      this._validateMe();
      return;
    }

    this.registerService
      .registration(value)
      .pipe(take(1))
      .subscribe((res: BikeboxResponse) => {
        if (res.id) {
          this.registerService.verificationData = {
            userId: res.id,
            phone: value.phone,
          };
          this.router.navigate(['register/credit-card']);
        } else {
          this.apiStatusCode = (
            res.code ?? REQUIRED_FIELDS_STATUS_CODE
          ).toString();
        }
      });

    G.KeyboardVisible = false;
  }

  ngOnDestroy(): void {
    G.KeyboardVisible = false;
  }
}
