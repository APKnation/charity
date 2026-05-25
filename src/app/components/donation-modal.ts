import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StateService } from '../services/state.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-donation-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    @if (stateService.isDonationModalOpen()) {
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md overflow-y-auto">
        <!-- Modal Card -->
        <div class="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden animate-modal-enter">
          
          <!-- Header (hidden in success step) -->
          @if (step() !== 'success' && step() !== 'processing') {
            <div class="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <h3 class="font-bold text-lg text-slate-800">Support: {{ campaign()?.title }}</h3>
                <p class="text-xs text-slate-400 mt-0.5">Empower change with your contribution</p>
              </div>
              <button (click)="close()" class="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
          }

          <!-- Wizard Progress Bar -->
          @if (step() !== 'success' && step() !== 'processing') {
            <div class="w-full bg-slate-100 h-1">
              <div [class]="progressWidthClass()" class="bg-gradient-to-r from-emerald-500 to-teal-500 h-1 transition-all duration-300"></div>
            </div>
          }

          <!-- Content Body -->
          <div class="p-6 md:p-8">
            
            <!-- STEP 1: Select Amount -->
            @if (step() === 'amount') {
              <div class="space-y-6">
                <div>
                  <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Select Donation Amount</label>
                  <div class="grid grid-cols-3 gap-2.5">
                    @for (preset of presetAmounts; track preset) {
                      <button 
                        (click)="selectAmount(preset)"
                        [class.bg-emerald-600]="amount() === preset && !isCustomSelected()"
                        [class.text-white]="amount() === preset && !isCustomSelected()"
                        [class.border-emerald-600]="amount() === preset && !isCustomSelected()"
                        [class.bg-slate-50]="amount() !== preset || isCustomSelected()"
                        [class.hover:bg-slate-100]="amount() !== preset || isCustomSelected()"
                        class="py-3 border border-slate-200/80 rounded-2xl font-semibold text-sm transition-all duration-200"
                      >
                        TSh {{ preset | number }}
                      </button>
                    }
                  </div>
                </div>

                <!-- Custom Amount Input -->
                <div class="relative">
                  <span class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-semibold text-sm">TSh</span>
                  <input 
                    type="number" 
                    [(ngModel)]="customAmount" 
                    (input)="onCustomAmountInput()"
                    placeholder="Enter custom amount" 
                    class="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200/80 focus:border-emerald-500 rounded-2xl text-slate-800 font-medium placeholder-slate-400 focus:outline-none transition-colors"
                  >
                </div>

                <!-- Recurring toggle -->
                <div class="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                  <div class="flex items-center gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 8H17" />
                    </svg>
                    <div>
                      <div class="text-xs font-bold text-slate-700">Make this a recurring donation</div>
                      <div class="text-[10px] text-slate-400">Support our operations monthly</div>
                    </div>
                  </div>
                  <input 
                    type="checkbox" 
                    [(ngModel)]="isRecurring" 
                    class="w-4 h-4 text-emerald-600 border-slate-300 rounded focus:ring-emerald-500 cursor-pointer"
                  >
                </div>

                <!-- Anonymous checkbox -->
                <div class="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                  <div class="flex items-center gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                    <div>
                      <div class="text-xs font-bold text-slate-700">Donate anonymously</div>
                      <div class="text-[10px] text-slate-400">Keep my name private on the campaign feed</div>
                    </div>
                  </div>
                  <input 
                    type="checkbox" 
                    [(ngModel)]="isAnonymous" 
                    class="w-4 h-4 text-emerald-600 border-slate-300 rounded focus:ring-emerald-500 cursor-pointer"
                  >
                </div>

                <!-- Action Button -->
                <button 
                  (click)="goToBilling()" 
                  [disabled]="amount() <= 0"
                  class="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-2xl font-bold text-center shadow-lg shadow-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  Continue to Info (TSh {{ amount() | number }})
                </button>
              </div>
            }

            <!-- STEP 2: Billing Info -->
            @if (step() === 'billing') {
              <div class="space-y-5">
                <div class="space-y-4">
                  <div>
                    <label class="block text-xs font-bold text-slate-500 mb-1.5">Full Name</label>
                    <input 
                      type="text" 
                      [(ngModel)]="donorName" 
                      [disabled]="isAnonymous"
                      placeholder="e.g. Bill Gates" 
                      class="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-xl text-slate-800 font-medium focus:outline-none transition-colors"
                    >
                  </div>
                  <div>
                    <label class="block text-xs font-bold text-slate-500 mb-1.5">Email Address</label>
                    <input 
                      type="email" 
                      [(ngModel)]="donorEmail" 
                      placeholder="e.g. billing&#64;gatesfoundation.org" 
                      class="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-xl text-slate-800 font-medium focus:outline-none transition-colors"
                    >
                  </div>
                </div>

                <div class="flex items-center gap-3 pt-3">
                  <button 
                    (click)="step.set('amount')" 
                    class="w-1/3 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl font-bold transition-colors"
                  >
                    Back
                  </button>
                  <button 
                    (click)="goToPayment()" 
                    [disabled]="!donorEmail || (!isAnonymous && !donorName)"
                    class="w-2/3 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-bold shadow-lg shadow-emerald-500/10 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Choose Payment
                  </button>
                </div>
              </div>
            }

            <!-- STEP 3: Payment Method selection -->
            @if (step() === 'payment') {
              <div class="space-y-5">
                <!-- Payment methods tabs -->
                <div class="flex border-b border-slate-100 pb-1">
                  @for (method of paymentMethods; track method.id) {
                    <button 
                      (click)="selectedMethod.set(method.id)"
                      [class.border-emerald-500]="selectedMethod() === method.id"
                      [class.text-emerald-600]="selectedMethod() === method.id"
                      [class.border-transparent]="selectedMethod() !== method.id"
                      [class.text-slate-400]="selectedMethod() !== method.id"
                      class="flex-1 text-center pb-3 border-b-2 font-bold text-xs uppercase tracking-wider transition-all duration-200"
                    >
                      {{ method.label }}
                    </button>
                  }
                </div>

                <!-- Form based on payment method -->
                <div class="bg-slate-50/50 p-4 rounded-2xl border border-slate-100 space-y-3.5">
                  @if (selectedMethod() === 'momo') {
                    <div class="space-y-3">
                      <label class="block text-xs font-bold text-slate-600">Mobile Money Number</label>
                      <div class="flex gap-2">
                        <select class="bg-white border border-slate-200 px-3 py-2 rounded-xl text-xs font-semibold focus:outline-none">
                          <option>MTN</option>
                          <option>Airtel</option>
                          <option>M-Pesa</option>
                        </select>
                        <input 
                          type="tel" 
                          placeholder="e.g. 0781234567" 
                          class="flex-grow px-3 py-2 bg-white border border-slate-200 focus:border-emerald-500 rounded-xl text-sm focus:outline-none"
                        >
                      </div>
                      <p class="text-[10px] text-slate-400">A push notification request will be sent to your phone to confirm transaction.</p>
                    </div>
                  } @else if (selectedMethod() === 'card') {
                    <div class="space-y-3">
                      <div>
                        <label class="block text-xs font-bold text-slate-600 mb-1">Card Number</label>
                        <input 
                          type="text" 
                          placeholder="4000 1234 5678 9010" 
                          class="w-full px-3 py-2 bg-white border border-slate-200 focus:border-emerald-500 rounded-xl text-sm focus:outline-none"
                        >
                      </div>
                      <div class="grid grid-cols-2 gap-3">
                        <div>
                          <label class="block text-xs font-bold text-slate-600 mb-1">Expiry Date</label>
                          <input 
                            type="text" 
                            placeholder="MM/YY" 
                            class="w-full px-3 py-2 bg-white border border-slate-200 focus:border-emerald-500 rounded-xl text-sm focus:outline-none text-center"
                          >
                        </div>
                        <div>
                          <label class="block text-xs font-bold text-slate-600 mb-1">CVV</label>
                          <input 
                            type="password" 
                            placeholder="123" 
                            maxlength="4"
                            class="w-full px-3 py-2 bg-white border border-slate-200 focus:border-emerald-500 rounded-xl text-sm focus:outline-none text-center"
                          >
                        </div>
                      </div>
                    </div>
                  } @else if (selectedMethod() === 'bank') {
                    <div class="space-y-3">
                      <label class="block text-xs font-bold text-slate-600">Select Bank</label>
                      <select class="w-full bg-white border border-slate-200 px-3 py-2 rounded-xl text-sm focus:outline-none">
                        <option>Equity Bank</option>
                        <option>KCB Bank</option>
                        <option>Barclays Bank</option>
                        <option>Standard Chartered</option>
                      </select>
                      <div>
                        <label class="block text-xs font-bold text-slate-600 mb-1">Account Number</label>
                        <input 
                          type="text" 
                          placeholder="Enter bank account number" 
                          class="w-full px-3 py-2 bg-white border border-slate-200 focus:border-emerald-500 rounded-xl text-sm focus:outline-none"
                        >
                      </div>
                    </div>
                  }
                </div>

                <div class="flex items-center gap-3 pt-3">
                  <button 
                    (click)="step.set('billing')" 
                    class="w-1/3 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl font-bold transition-colors"
                  >
                    Back
                  </button>
                  <button 
                    (click)="processPayment()" 
                    class="w-2/3 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-bold shadow-lg shadow-emerald-500/10 flex items-center justify-center gap-2 hover:scale-[1.01] transition-transform"
                  >
                    <span>Secure Pay TSh {{ amount() | number }}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                  </button>
                </div>
              </div>
            }

            <!-- STEP 4: Processing State (Mock payment gateway simulation) -->
            @if (step() === 'processing') {
              <div class="py-12 flex flex-col items-center justify-center space-y-6">
                <!-- Outer Ring Spinner -->
                <div class="relative w-20 h-20">
                  <div class="absolute inset-0 rounded-full border-4 border-slate-100"></div>
                  <div class="absolute inset-0 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin"></div>
                  <div class="absolute inset-4 bg-emerald-50/50 rounded-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-emerald-600 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                </div>
                <div class="text-center space-y-1.5">
                  <h4 class="font-bold text-slate-800 text-lg">Securing Donation...</h4>
                  <p class="text-xs text-slate-400 max-w-xs mx-auto">{{ processingStatusText() }}</p>
                </div>
              </div>
            }

            <!-- STEP 5: Success Receipt Panel -->
            @if (step() === 'success') {
              <div class="flex flex-col items-center space-y-6 animate-scale-up">
                <!-- Checkmark circle -->
                <div class="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center shadow-lg shadow-emerald-100/35">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>

                <div class="text-center space-y-1">
                  <h4 class="font-black text-slate-800 text-2xl tracking-tight">Thank You!</h4>
                  <p class="text-sm text-slate-400">Your donation was completed successfully.</p>
                </div>

                <!-- Receipt Sheet Details -->
                <div class="w-full bg-slate-50 border border-slate-200/80 rounded-2xl p-5 text-xs space-y-3.5 relative overflow-hidden">
                  <!-- Dotted Divider line decoration -->
                  <div class="absolute left-0 right-0 top-[60px] border-b border-dashed border-slate-200"></div>

                  <!-- Campaign title -->
                  <div>
                    <span class="text-[9px] uppercase font-bold tracking-wider text-slate-400 block mb-0.5">Campaign Name</span>
                    <span class="font-bold text-slate-800 block text-sm truncate">{{ campaign()?.title }}</span>
                  </div>

                  <!-- Grid of details -->
                  <div class="grid grid-cols-2 gap-y-3.5 pt-4">
                    <div>
                      <span class="text-[9px] uppercase font-bold tracking-wider text-slate-400 block mb-0.5">Donated Amount</span>
                      <span class="font-extrabold text-emerald-600 text-base">TSh {{ amount() | number }}</span>
                    </div>
                    <div>
                      <span class="text-[9px] uppercase font-bold tracking-wider text-slate-400 block mb-0.5">Transaction ID</span>
                      <span class="font-mono text-slate-600 font-semibold uppercase">TX-{{ receiptTxId() }}</span>
                    </div>
                    <div>
                      <span class="text-[9px] uppercase font-bold tracking-wider text-slate-400 block mb-0.5">Date</span>
                      <span class="font-bold text-slate-800">{{ receiptDate() }}</span>
                    </div>
                    <div>
                      <span class="text-[9px] uppercase font-bold tracking-wider text-slate-400 block mb-0.5">Donor Name</span>
                      <span class="font-bold text-slate-800">{{ isAnonymous ? 'Anonymous' : donorName }}</span>
                    </div>
                  </div>
                </div>

                <!-- Action CTAs -->
                <div class="w-full flex gap-3 pt-2">
                  <button 
                    (click)="downloadReceipt()"
                    class="w-1/2 py-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-xs transition-colors flex items-center justify-center gap-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                    <span>Download Invoice</span>
                  </button>
                  <button 
                    (click)="close()" 
                    class="w-1/2 py-3.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold text-xs transition-colors"
                  >
                    Close Window
                  </button>
                </div>
              </div>
            }
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .animate-modal-enter {
      animation: modalEnter 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
    }
    @keyframes modalEnter {
      from { transform: translateY(30px) scale(0.95); opacity: 0; }
      to { transform: translateY(0) scale(1); opacity: 1; }
    }
    .animate-scale-up {
      animation: scaleUp 0.3s ease-out forwards;
    }
    @keyframes scaleUp {
      from { transform: scale(0.92); opacity: 0; }
      to { transform: scale(1); opacity: 1; }
    }
  `]
})
export class DonationModalComponent {
  stateService = inject(StateService);
  authService = inject(AuthService);

  step = signal<'amount' | 'billing' | 'payment' | 'processing' | 'success'>('amount');
  presetAmounts = [5000, 10000, 25000, 50000, 100000, 250000];
  
  // Model state variables
  amount = signal<number>(10000);
  customAmount = '';
  isCustomSelected = signal(false);
  isRecurring = false;
  isAnonymous = false;
  
  donorName = '';
  donorEmail = '';

  selectedMethod = signal<'card' | 'momo' | 'bank'>('card');
  paymentMethods: { id: 'card' | 'momo' | 'bank'; label: string }[] = [
    { id: 'card', label: 'Credit Card' },
    { id: 'momo', label: 'Mobile Money' },
    { id: 'bank', label: 'Bank Direct' }
  ];

  processingStatusText = signal('Initializing secure handshake...');
  receiptTxId = signal('');
  receiptDate = signal('');

  campaign = computed(() => {
    const id = this.stateService.donationCampaignId();
    if (id === null) return null;
    return this.stateService.campaigns().find(c => c.id === id) || null;
  });

  progressWidthClass = computed(() => {
    switch (this.step()) {
      case 'amount': return 'w-1/3';
      case 'billing': return 'w-2/3';
      case 'payment': return 'w-full';
      default: return 'w-0';
    }
  });

  constructor() {
    // Autofill donor details if authenticated
    const user = this.authService.currentUser();
    if (user.role !== 'guest') {
      this.donorName = user.name;
      this.donorEmail = user.email;
    }
  }

  selectAmount(val: number) {
    this.amount.set(val);
    this.isCustomSelected.set(false);
    this.customAmount = '';
  }

  onCustomAmountInput() {
    const val = parseFloat(this.customAmount);
    if (!isNaN(val) && val > 0) {
      this.amount.set(val);
      this.isCustomSelected.set(true);
    } else {
      this.amount.set(0);
    }
  }

  goToBilling() {
    if (this.amount() > 0) {
      this.step.set('billing');
    }
  }

  goToPayment() {
    if (this.donorEmail && (this.isAnonymous || this.donorName)) {
      this.step.set('payment');
    }
  }

  processPayment() {
    this.step.set('processing');
    
    // Simulate gateway delay API steps
    setTimeout(() => {
      this.processingStatusText.set('Sending request to gateway provider...');
    }, 600);

    setTimeout(() => {
      this.processingStatusText.set('Awaiting response callback signature...');
    }, 1200);

    setTimeout(() => {
      // Execute local state update
      const campId = this.stateService.donationCampaignId();
      if (campId !== null) {
        const donationName = this.isAnonymous ? 'Anonymous' : this.donorName;
        const result = this.stateService.addDonation(
          campId,
          this.amount(),
          this.selectedMethod() === 'card' ? 'Card' : this.selectedMethod() === 'momo' ? 'Mobile Money' : 'Bank Transfer',
          this.isRecurring,
          this.isRecurring ? 'monthly' : 'once',
          donationName
        );
        if (result) {
          this.receiptTxId.set(result.id.toString().substring(6));
          this.receiptDate.set(result.date);
        }
      }
      this.step.set('success');
    }, 2000);
  }

  downloadReceipt() {
    const printContent = `
      ============================
      HOPEFLOW DONATION PLATFORM
      RECEIPT OF CONTRIBUTION
      ============================
      Transaction ID: TX-${this.receiptTxId()}
      Campaign: ${this.campaign()?.title}
      Date: ${this.receiptDate()}
      Donor: ${this.isAnonymous ? 'Anonymous' : this.donorName}
      Email: ${this.donorEmail}
      Amount: TSh ${this.amount().toLocaleString()}
      Status: COMPLETED (${this.isRecurring ? 'Monthly Subscription' : 'One-time donation'})
      
      Thank you for your generous support! Your contribution makes a direct difference.
    `;
    
    // Simulating file download by prompting simple text dump
    const blob = new Blob([printContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Receipt-TX-${this.receiptTxId()}.txt`;
    link.click();
    window.URL.revokeObjectURL(url);
  }

  close() {
    this.stateService.closeDonationModal();
    // Reset wizard
    this.step.set('amount');
    this.amount.set(50);
    this.customAmount = '';
    this.isCustomSelected.set(false);
    this.isRecurring = false;
    this.isAnonymous = false;
  }
}
