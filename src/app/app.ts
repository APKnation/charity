import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DonationModalComponent } from './components/donation-modal';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, DonationModalComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {}
