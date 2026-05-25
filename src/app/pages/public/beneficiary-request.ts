import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { StateService } from '../../services/state.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-beneficiary-request',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="max-w-xl mx-auto px-4 py-12">
      <div class="bg-white border border-slate-200/80 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
        
        <!-- Header -->
        <div class="text-center space-y-1.5">
          <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-100 text-amber-600 text-[10px] font-bold uppercase tracking-wider">
            Direct Aid
          </span>
          <h1 class="text-2xl font-black text-slate-800 tracking-tight">Request Financial Help</h1>
          <p class="text-xs text-slate-400 max-w-sm mx-auto">Submit your community project or medical funding application for evaluation.</p>
        </div>

        @if (submitted()) {
          <!-- Success State -->
          <div class="py-6 flex flex-col items-center text-center space-y-4 animate-scale-up">
            <div class="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center border border-emerald-100 shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div class="space-y-1">
              <h3 class="font-bold text-slate-800 text-base">Request Submitted!</h3>
              <p class="text-xs text-slate-400 max-w-xs leading-relaxed">
                Thank you, <strong>{{ beneficiaryName }}</strong>. Your assistance petition <strong>"{{ title }}"</strong> for <strong>\${{ requestedAmount | number }}</strong> has been filed.
              </p>
              <p class="text-[10px] text-amber-600 font-semibold mt-2 bg-amber-50 p-2 rounded-lg border border-amber-100/50">
                Tip: Switch to the Admin role to approve or reject this request!
              </p>
            </div>
            <div class="pt-4 flex gap-3 w-full">
              <a routerLink="/" class="flex-1 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold text-center">Go to Home</a>
              <button (click)="resetForm()" class="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold">New Request</button>
            </div>
          </div>
        } @else {
          <!-- Form -->
          <form (ngSubmit)="onSubmit()" class="space-y-4 text-xs font-semibold text-slate-600">
            <!-- Name -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-slate-500 mb-1.5">Your Full Name</label>
                <input 
                  type="text" 
                  [(ngModel)]="beneficiaryName" 
                  name="beneficiaryName" 
                  required 
                  placeholder="e.g. Jane Doe" 
                  class="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-xl text-slate-800 font-medium focus:outline-none"
                >
              </div>
              <div>
                <label class="block text-slate-500 mb-1.5">Email Address</label>
                <input 
                  type="email" 
                  [(ngModel)]="beneficiaryEmail" 
                  name="beneficiaryEmail" 
                  required 
                  placeholder="e.g. jane.help&#64;gmail.com" 
                  class="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-xl text-slate-800 font-medium focus:outline-none"
                >
              </div>
            </div>

            <!-- Title -->
            <div>
              <label class="block text-slate-500 mb-1.5">Help Request Title</label>
              <input 
                type="text" 
                [(ngModel)]="title" 
                name="title" 
                required 
                placeholder="e.g. Clean Water Well Construction" 
                class="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-xl text-slate-800 font-medium focus:outline-none"
              >
            </div>

            <!-- Description -->
            <div>
              <label class="block text-slate-500 mb-1.5">Detailed Needs Statement</label>
              <textarea 
                [(ngModel)]="description" 
                name="description" 
                rows="4" 
                required
                placeholder="Explain the necessity, who is impacted, and how the funds will be utilized..." 
                class="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-xl text-slate-800 font-medium focus:outline-none leading-relaxed"
              ></textarea>
            </div>

            <!-- Requested Amount -->
            <div>
              <label class="block text-slate-500 mb-1.5">Requested Funding Amount ($)</label>
              <div class="relative">
                <span class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-semibold text-base">$</span>
                <input 
                  type="number" 
                  [(ngModel)]="requestedAmount" 
                  name="requestedAmount" 
                  required 
                  placeholder="e.g. 5000" 
                  class="w-full pl-8 pr-4 py-3 bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-xl text-slate-800 font-medium focus:outline-none"
                >
              </div>
            </div>

            <!-- Supporting Documents Upload Simulator -->
            <div>
              <label class="block text-slate-500 mb-2">Upload Supporting Identification / Proof (Medical logs, quotes)</label>
              <div class="flex items-center justify-center w-full">
                <label class="flex flex-col items-center justify-center w-full h-32 border-2 border-slate-200 border-dashed rounded-2xl cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors">
                  <div class="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg class="w-8 h-8 mb-2.5 text-slate-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                      <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                    </svg>
                    <p class="text-xs text-slate-500 mb-1"><span class="font-bold text-emerald-600">Click to upload files</span></p>
                    <p class="text-[10px] text-slate-400">PDF, PNG, JPG up to 10MB</p>
                  </div>
                  <input type="file" class="hidden" (change)="onFileSelected($event)" multiple />
                </label>
              </div>

              <!-- List of uploaded files -->
              @if (documentsList().length > 0) {
                <div class="mt-3.5 space-y-1.5">
                  <span class="text-[10px] text-slate-400 font-bold block mb-1">Files Attached:</span>
                  @for (docName of documentsList(); track docName) {
                    <div class="flex items-center justify-between bg-slate-50 border border-slate-200/80 px-3 py-1.5 rounded-lg text-[10px]">
                      <span class="font-medium text-slate-700">{{ docName }}</span>
                      <button type="button" (click)="removeFile(docName)" class="text-rose-500 hover:text-rose-700">Remove</button>
                    </div>
                  }
                </div>
              }
            </div>

            <button 
              type="submit" 
              [disabled]="!beneficiaryName || !beneficiaryEmail || !title || !description || requestedAmount <= 0"
              class="w-full py-3.5 mt-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-xl font-bold text-center shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              Submit Application
            </button>
          </form>
        }

      </div>
    </div>
  `,
  styles: [`
    .animate-scale-up {
      animation: scaleUp 0.3s ease-out forwards;
    }
    @keyframes scaleUp {
      from { transform: scale(0.95); opacity: 0; }
      to { transform: scale(1); opacity: 1; }
    }
  `]
})
export class BeneficiaryRequestPage {
  stateService = inject(StateService);
  authService = inject(AuthService);

  beneficiaryName = '';
  beneficiaryEmail = '';
  title = '';
  description = '';
  requestedAmount = 1000;
  documentsList = signal<string[]>([]);
  submitted = signal(false);

  constructor() {
    // Auto-fill logged in user info if beneficiary
    const user = this.authService.currentUser();
    if (user.role === 'beneficiary') {
      this.beneficiaryName = user.name;
      this.beneficiaryEmail = user.email;
    }
  }

  onFileSelected(event: any) {
    const files: FileList = event.target.files;
    if (files) {
      const names: string[] = [];
      for (let i = 0; i < files.length; i++) {
        names.push(files[i].name);
      }
      this.documentsList.update(list => [...list, ...names]);
    }
  }

  removeFile(name: string) {
    this.documentsList.update(list => list.filter(n => n !== name));
  }

  onSubmit() {
    if (this.beneficiaryName && this.beneficiaryEmail && this.title && this.description && this.requestedAmount > 0) {
      this.stateService.requestHelp(
        this.beneficiaryName,
        this.beneficiaryEmail,
        this.title,
        this.description,
        this.requestedAmount,
        this.documentsList()
      );
      this.submitted.set(true);
    }
  }

  resetForm() {
    this.submitted.set(false);
    this.beneficiaryName = '';
    this.beneficiaryEmail = '';
    this.title = '';
    this.description = '';
    this.requestedAmount = 1000;
    this.documentsList.set([]);
  }
}
