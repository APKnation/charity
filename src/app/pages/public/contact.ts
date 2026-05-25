import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

interface FaqItem {
  id: number;
  question: string;
  answer: string;
  isOpen: boolean;
}

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      
      <!-- Page Header -->
      <div class="text-center max-w-2xl mx-auto space-y-2">
        <span class="text-xs font-bold text-emerald-600 uppercase tracking-widest">Connect</span>
        <h1 class="text-3xl sm:text-4xl font-black tracking-tight text-slate-800">We\\'d Love to Hear From You</h1>
        <p class="text-slate-400 text-sm">Have questions about donation receipts, active campaigns, or corporate partnership opportunities?</p>
      </div>

      <!-- Contact Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        <!-- Left: Form -->
        <div class="lg:col-span-7 bg-white border border-slate-200/60 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
          <h2 class="font-bold text-slate-800 text-lg">Send us a Message</h2>
          
          @if (submitted()) {
            <div class="py-12 flex flex-col items-center text-center space-y-4 animate-scale-up">
              <div class="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center border border-emerald-100 shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <div>
                <h3 class="font-bold text-slate-800 text-sm">Inquiry Received!</h3>
                <p class="text-xs text-slate-400 mt-1 max-w-xs leading-relaxed">Thank you, {{ contactName }}. We have logged your request and will reach out to you within 24 business hours.</p>
              </div>
              <button (click)="resetForm()" class="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 transition-colors">Send Another Message</button>
            </div>
          } @else {
            <form (ngSubmit)="onSubmit()" class="space-y-4 text-xs font-semibold text-slate-600">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="block text-slate-500 mb-1.5">Your Name</label>
                  <input 
                    type="text" 
                    [(ngModel)]="contactName" 
                    name="contactName" 
                    required 
                    placeholder="e.g. David Beckham" 
                    class="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-xl text-slate-800 font-medium focus:outline-none"
                  >
                </div>
                <div>
                  <label class="block text-slate-500 mb-1.5">Email Address</label>
                  <input 
                    type="email" 
                    [(ngModel)]="contactEmail" 
                    name="contactEmail" 
                    required 
                    placeholder="e.g. david.v&#64;gmail.com" 
                    class="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-xl text-slate-800 font-medium focus:outline-none"
                  >
                </div>
              </div>

              <div>
                <label class="block text-slate-500 mb-1.5">Subject</label>
                <input 
                  type="text" 
                  [(ngModel)]="subject" 
                  name="subject" 
                  required 
                  placeholder="e.g. Question about donation tax invoices" 
                  class="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-xl text-slate-800 font-medium focus:outline-none"
                >
              </div>

              <div>
                <label class="block text-slate-500 mb-1.5">Message</label>
                <textarea 
                  [(ngModel)]="message" 
                  name="message" 
                  rows="5" 
                  required
                  placeholder="Enter details of your question or feedback..." 
                  class="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-xl text-slate-800 font-medium focus:outline-none leading-relaxed"
                ></textarea>
              </div>

              <button 
                type="submit" 
                [disabled]="!contactName || !contactEmail || !subject || !message"
                class="w-full py-3.5 mt-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-xl font-bold text-center shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                Send Message
              </button>
            </form>
          }
        </div>

        <!-- Right: Location info / FAQs -->
        <div class="lg:col-span-5 space-y-6">
          <!-- Quick contact facts -->
          <div class="bg-slate-900 text-white rounded-3xl p-6 shadow-md space-y-4">
            <h2 class="font-bold text-base text-emerald-400">Headquarters</h2>
            <p class="text-xs text-slate-300 leading-relaxed">
              HopeFlow Humanitarian NGO <br>
              120 Foundation Way, Suite 400 <br>
              Nairobi, Kenya
            </p>
            <div class="pt-2 text-xs space-y-2 text-slate-300">
              <div class="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 00.996.808H12a1 1 0 00.996-.808l.548-2.2a1 1 0 01.94-.725H21a2 2 0 012 2v10a2 2 0 01-2 2h-3.28a1 1 0 01-.94-.725l-.548-2.2a1 1 0 00-.996-.808H12a1 1 0 00-.996.808l-.548 2.2a1 1 0 01-.94.725H5a2 2 0 01-2-2V5z" /></svg>
                <span>+254 700 123 456</span>
              </div>
              <div class="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                <span>contact&#64;hopeflow.org</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      <!-- FAQ ACCORDION SECTION -->
      <section class="space-y-6">
        <h2 class="font-black text-2xl tracking-tight text-slate-800 text-center">Frequently Asked Questions</h2>
        
        <div class="max-w-3xl mx-auto space-y-3.5">
          @for (faq of faqs(); track faq.id) {
            <div class="bg-white border border-slate-200/60 rounded-2xl overflow-hidden shadow-sm">
              <button 
                (click)="toggleFaq(faq.id)"
                class="w-full flex items-center justify-between p-5 text-left font-bold text-sm text-slate-700 hover:text-slate-900 focus:outline-none transition-colors"
              >
                <span>{{ faq.question }}</span>
                <span class="text-slate-400 ml-4 shrink-0">
                  @if (faq.isOpen) {
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" /></svg>
                  } @else {
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" /></svg>
                  }
                </span>
              </button>
              
              @if (faq.isOpen) {
                <div class="px-5 pb-5 text-xs text-slate-500 leading-relaxed border-t border-slate-50 pt-3.5 animate-slide-down">
                  {{ faq.answer }}
                </div>
              }
            </div>
          }
        </div>
      </section>

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
    .animate-slide-down {
      animation: slideDown 0.2s ease-out forwards;
    }
    @keyframes slideDown {
      from { transform: translateY(-10px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
  `]
})
export class Contact {
  contactName = '';
  contactEmail = '';
  subject = '';
  message = '';
  submitted = signal(false);

  faqs = signal<FaqItem[]>([
    {
      id: 1,
      question: 'How do I download my donation tax deduction receipt?',
      answer: 'After completing any donation, a downloadable receipt popup is immediately generated. Additionally, if you switch to the Donor role, you can access your complete donation history dashboard and download print-ready receipts for all contributions instantly.',
      isOpen: false
    },
    {
      id: 2,
      question: 'Can I donate anonymously?',
      answer: 'Yes! On the first step of the donation modal, check the "Donate anonymously" toggle. This will prevent your name from appearing on the public campaign activity feed, though administrative staff will still be able to securely verify the transaction.',
      isOpen: false
    },
    {
      id: 3,
      question: 'What payment methods do you support?',
      answer: 'We support major Credit/Debit Cards (Visa, MasterCard, American Express), Mobile Money gateways (M-Pesa, MTN MoMo, Orange Money), and direct bank transfers.',
      isOpen: false
    },
    {
      id: 4,
      question: 'How are volunteers assigned to projects?',
      answer: 'When you submit a volunteer application, you can select specific campaigns or apply for general operations. Once an admin coordinator reviews your skills, you will receive an invitation containing event logistics and timesheets.',
      isOpen: false
    }
  ]);

  toggleFaq(id: number) {
    this.faqs.update(list =>
      list.map(faq => faq.id === id ? { ...faq, isOpen: !faq.isOpen } : faq)
    );
  }

  onSubmit() {
    if (this.contactName && this.contactEmail && this.subject && this.message) {
      this.submitted.set(true);
    }
  }

  resetForm() {
    this.submitted.set(false);
    this.contactName = '';
    this.contactEmail = '';
    this.subject = '';
    this.message = '';
  }
}
