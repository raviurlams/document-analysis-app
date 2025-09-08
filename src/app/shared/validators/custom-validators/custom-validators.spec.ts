import { FormControl } from '@angular/forms';
import { CustomValidators } from './custom-validators';

describe('CustomValidators', () => {
  describe('patternValidator', () => {
    it('should return null when value matches pattern', () => {
      const validator = CustomValidators.patternValidator(/^[a-z]+$/, { invalidPattern: true });
      const control = new FormControl('abc');
      
      expect(validator(control)).toBeNull();
    });

    it('should return error when value does not match pattern', () => {
      const validator = CustomValidators.patternValidator(/^[a-z]+$/, { invalidPattern: true });
      const control = new FormControl('ABC');
      
      expect(validator(control)).toEqual({ invalidPattern: true });
    });

    it('should return null when value is empty', () => {
      const validator = CustomValidators.patternValidator(/^[a-z]+$/, { invalidPattern: true });
      const control = new FormControl('');
      
      expect(validator(control)).toBeNull();
    });
  });

  describe('passwordStrength', () => {
    it('should validate strong password', () => {
      const validator = CustomValidators.passwordStrength();
      const control = new FormControl('StrongPass1!');
      
      expect(validator(control)).toBeNull();
    });

    it('should detect missing lowercase', () => {
      const validator = CustomValidators.passwordStrength();
      const control = new FormControl('STRONGPASS1!');
      
      expect(validator(control)).toEqual({ lowercase: true });
    });

    it('should detect missing uppercase', () => {
      const validator = CustomValidators.passwordStrength();
      const control = new FormControl('strongpass1!');
      
      expect(validator(control)).toEqual({ uppercase: true });
    });

    it('should detect missing digit', () => {
      const validator = CustomValidators.passwordStrength();
      const control = new FormControl('StrongPass!');
      
      expect(validator(control)).toEqual({ digit: true });
    });

    it('should detect missing special character', () => {
      const validator = CustomValidators.passwordStrength();
      const control = new FormControl('StrongPass1');
      
      expect(validator(control)).toEqual({ special: true });
    });

    it('should detect short password', () => {
      const validator = CustomValidators.passwordStrength();
      const control = new FormControl('Short1!');
      
      expect(validator(control)).toEqual({ 
        minlength: { requiredLength: 8, actualLength: 7 } 
      });
    });
  });

  describe('matchValues', () => {
    it('should return null when values match', () => {
      const validator = CustomValidators.matchValues('password');
      const control = new FormControl('matchingValue');
      
      // Create a parent form control
      const parentControl = new FormControl({
        password: 'matchingValue',
        confirmPassword: 'matchingValue'
      });
      
      control.setParent(parentControl);
      
      expect(validator(control)).toBeNull();
    });

    it('should return error when values do not match', () => {
      const validator = CustomValidators.matchValues('password');
      const control = new FormControl('differentValue');
      
      // Create a parent form control
      const parentControl = new FormControl({
        password: 'originalValue',
        confirmPassword: 'differentValue'
      });
      
      control.setParent(parentControl);
      
      expect(validator(control)).toEqual({ noMatch: true });
    });
  });
});