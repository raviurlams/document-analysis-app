import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class CustomValidators {
  static patternValidator(regex: RegExp, error: ValidationErrors): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      if (!control.value) {
        return null;
      }
      
      const valid = regex.test(control.value);
      return valid ? null : error;
    };
  }

  static passwordStrength(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }
      
      const errors: ValidationErrors = {};
      const value: string = control.value;
      
      if (value.length < 8) {
        errors['minlength'] = { requiredLength: 8, actualLength: value.length };
      }
      
      if (!/(?=.*[a-z])/.test(value)) {
        errors['lowercase'] = true;
      }
      
      if (!/(?=.*[A-Z])/.test(value)) {
        errors['uppercase'] = true;
      }
      
      if (!/(?=.*[0-9])/.test(value)) {
        errors['digit'] = true;
      }
      
      if (!/(?=.*[!@#$%^&*])/.test(value)) {
        errors['special'] = true;
      }
      
      return Object.keys(errors).length ? errors : null;
    };
  }

  static matchValues(matchTo: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.parent) {
        return null;
      }
      
      const matchingControl = control.parent.get(matchTo);
      if (!matchingControl) {
        return null;
      }
      
      if (control.value !== matchingControl.value) {
        return { noMatch: true };
      }
      
      return null;
    };
  }
}