import { Component } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VowelService } from '../service/vowel.service';
import { HeaderComponent } from '../../Shared/header/header.component';


@Component({
  selector: 'app-vowel',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent],
  templateUrl: './vowel.component.html',
  styleUrls: ['./vowel.component.scss']
})
export class VowelComponent {
  inputString: string = '';
  result: any = null;

  constructor(private vowelService: VowelService) { }

  findVowel() {
    const startTime = Date.now();
    const vogal = this.vowelService.findVowel(this.inputString);
    const endTime = Date.now();
    const tempoTotal = `${endTime - startTime}ms`;

    this.result = {
      string: this.inputString,
      vogal,
      tempoTotal
    };
  }
}
