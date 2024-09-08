import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class VowelService {

  constructor() { }

  findVowel(str: string): string | null {
    const vowels = 'aeiouAEIOU';
    const consonants = 'bcdfghjklmnpqrstvwxyzBCDFGHJKLMNPQRSTVWXYZ';

    for (let i = 2; i < str.length; i += 3) {
      const char = str[i];
      const prevChar = str[i - 1];
      const prevPrevChar = str[i - 2];

      if (vowels.includes(char) && consonants.includes(prevChar) && vowels.includes(prevPrevChar)) {
        return char;
      }
    }

    return null;
  }
}
