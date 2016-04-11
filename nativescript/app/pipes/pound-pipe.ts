import {Pipe, PipeTransform} from 'angular2/core';

@Pipe({name: 'pound'})
export class PoundPipe implements PipeTransform {
    transform(value:number) : string {
        return this.toCurrencyString(value, '.', ',', 0);
    }
  
    toCurrencyString(number: number, decimalSeparator: string, thousandsSeparator: string, nDecimalDigits: number): string {
        //default values
        decimalSeparator = decimalSeparator || '.';
        thousandsSeparator = thousandsSeparator || ',';
        nDecimalDigits = nDecimalDigits == null? 2 : nDecimalDigits;

        var fixed = number.toFixed(nDecimalDigits), //limit/add decimal digits
            parts = new RegExp('^(-?\\d{1,3})((?:\\d{3})+)(\\.(\\d{'+ nDecimalDigits +'}))?$').exec( fixed ); //separate begin [$1], middle [$2] and decimal digits [$4]

        if(parts){ //number >= 1000 || number <= -1000
            return "£" + parts[1] + parts[2].replace(/\d{3}/g, thousandsSeparator + '$&') + (parts[4] ? decimalSeparator + parts[4] : '');
        }else{
            return "£" + fixed.replace('.', decimalSeparator);
        }
    }
}