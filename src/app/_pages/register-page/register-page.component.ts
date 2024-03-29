﻿import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { GKeybLanGlobal as G } from '@app/_globals';

import { UsersAccountService, AlertService, GUser } from '@app/_services';
import { LangValidator } from '@app/_helpers/lang.validators';
import { Subscription } from 'rxjs';
import { UserModel, WideUserModel } from '@app/_models';
import { environment } from '@environments/environment';
import { Router } from '@angular/router';
import { FlowType } from '@app/_models/flow-type.enum';
import { HeaderSize } from '@app/_models/header-size.enum';
import { TranslocoService } from '@ngneat/transloco';

const TO_TEST_USER = environment.toTestUsers;

@Component({
  selector: 'register-form',

  templateUrl: 'register-page.component.html',
  styleUrls: ['register-page.component.scss'],
})
export class RegisterPageComponent implements OnInit, OnDestroy {
  //IEFM<UserModel>{
  readonly env = environment;
  form!: FormGroup;
  loading = false;
  submitted = false;

  flowType = FlowType.register;
  headerSize = HeaderSize.small;
  //flags = this.userSvc.flags;
  termsMessage: string = '';
  policyMessage: string = '';

  constructor(
    private router: Router,
    private userSvc: UsersAccountService,
    private alertSvc: AlertService,
    private translocoService: TranslocoService
  ) {}
  get user() {
    return GUser;
  }

  model?: UserModel | undefined;
  get itsOK(): boolean {
    return this.form.valid;
  }

  private subs: Subscription[] = [];

  ngOnDestroy(): void {
    this.subs.forEach((s) => s.unsubscribe());
    G.KeyboardVisible = false;
  }

  ngOnInit() {
    G.setVisibleKeybToggle(true);
    G.KeyboardVisible = true;
    this._createRegisterForm();
  }

  private _createRegisterForm() {
    //debugger;
    //If was Login
    let _sysName = '';
    let _password = '';
    let __user = this.userSvc.userValue;

    if (__user) {
      _sysName = __user.sysname;
      _password = __user.password;
    }

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
      phone: new FormControl('', [
        LangValidator.required('phone'),
        LangValidator.number('phone', 7, 12),
      ]),
      address: new FormControl<string>('', [LangValidator.required('address')]),
      ravkav: new FormControl<string>('', [
        // LangValidator.required("address")
      ]),

      //  ravkav: new FormControl('',[]),

      imagreeTerms: new FormControl<boolean>(false, [
        LangValidator.requiredTrue('imagreeTerms'),
      ]),
      imagreePolicy: new FormControl<boolean>(false, [
        LangValidator.requiredTrue('imagreePolicy'),
      ]),
    });
  }

  _updateForm(wideUser: WideUserModel | undefined) {
    if (!!wideUser) {
      this.f['firstName'].setValue(wideUser.firstName);
      this.f['lastName'].setValue(wideUser.lastName);
      this.f['sysname'].setValue(wideUser.sysname);
      this.f['password'].setValue(wideUser.password);
      this.f['passport'].setValue(wideUser.passport);
      this.f['email'].setValue(wideUser.email);
      this.f['phone'].setValue(wideUser.phone);
      this.f['address'].setValue(wideUser.address);
      this.f['ravkav'].setValue(wideUser.ravkav);
      this.f['imagreeTerms'].setValue(true);
      this.f['imagreePolicy'].setValue(true);
    }
  }

  OnSliderChange(evt: any, ctrlName: string) {
    //'imagreePolicy'

    const c = this.f[ctrlName] as FormControl;
    c.markAsTouched({ onlySelf: true });
    const checked = !!evt?.target?.checked;
    if (c.value != checked) {
      c.setValue(checked);
    }
    console.log(`OnSliderChange:(${ctrlName})=${c.value}`);
    //console.log(c.name,c.touched);
  }

  // private _onLangChange(v: TLangNames) {
  //   //this change language for validation strings
  //   // LangValidator.Lang = v;
  //   /// To event !!!
  //   // this._Lang = v;
  //   this.flds = USER_DATA_MULTI[this._Lang] as IUserDetailsFieldsData; //{...USER_DATA_MULTI[this._Lang]};
  //   console.log(`Set Lang ${v}:${ILANG_DESCR[v].name}`);
  //   this._validateMe();
  // }
  private _validateMe() {
    //   try {
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
    //    } catch (error) {

    //    }
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.form.controls;
  }
  get valid() {
    return this.form.valid;
  }
  // c(ctrlName:string) { return this.f[ctrlName] as FormControl; }

  getClasses(cname: string) {
    const fc = this.f[cname] as FormControl;

    const c = {
      'is-invalid': !!fc?.touched && !!fc?.errors,
      'is-valid': !!fc?.valid,
      // 'is-active': cname === this.active
    };
    return c;
  }

  async onSubmit() {
    this.router.navigate(['register/credit-card']);
    // this.submitted = true;

    // // reset alerts on submit
    // this.alertSvc.clear();

    // // stop here if form is invalid
    // if (this.form.invalid) {
    //   console.log(this.form);

    //   this._validateMe();
    //   return;
    // }

    // try {
    //   this.loading = true;
    //   const model: UserModel = new UserModel(this.form.value);
    //   this.model = model;
    //   await this.userSvc.saveUser$(model, false);
    //   this.loading = false;
    //   // this.userSvc.flags.fVisa = true;
    //   this.alertSvc.success('Registration successful', {
    //     keepAfterRouteChange: true,
    //   });
    //   this.userSvc.gotoCreditCard$(); //model);///!!!
    //   this.router.navigate(['/credit-card'], { relativeTo: this.route });
    // } catch (error) {
    //   this.alertSvc.error('Submit Registration' + error);
    // }
    // G.KeyboardVisible = false;
  }
}
// async getAviKohen(){
//   this.form.reset();
//   try {
//     const  wideUser = await this.userSvc.retrieveWideUser$(false);
//     this._updateForm(wideUser);

//   } catch (error) {

//   }

//     //this.userSvc.retrieveUsers$

// }
// async getRandomUser(){
//   this.form.reset();
//   try {
//     const  wideUser = await this.userSvc.retrieveWideUser$(true);
//     this._updateForm(wideUser);

//   } catch (error) {

//   }

// }

// getClasses(cname:string) {
//   const fc = this.f[cname];

//   const ret =  {

//     'is-invalid': !!fc?.touched && !!fc?.errors,
//     'is-valid': !!fc?.valid ,
//    // 'is-active': cname === this.active
//   }
//   return ret;
// }
// getClasses2(cname:string) {
//   const fc = this.f[cname];

//   return {

//     'is-invalid': !!fc?.touched && !!fc?.errors,
//     'is-valid': !!fc?.valid
//   }
// }
