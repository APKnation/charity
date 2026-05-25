import { Injectable, signal, effect } from '@angular/core';

export interface CampaignUpdate {
  id: number;
  date: string;
  content: string;
}

export interface Campaign {
  id: number;
  title: string;
  description: string;
  category: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  mediaUrl: string;
  status: 'active' | 'closed' | 'pending';
  createdDate: string;
  donorCount: number;
  volunteersCount: number;
  updates: CampaignUpdate[];
}

export interface Donation {
  id: number;
  campaignId: number;
  campaignTitle: string;
  amount: number;
  date: string;
  donorName: string;
  paymentMethod: string;
  status: 'completed' | 'refunded' | 'pending';
  isRecurring: boolean;
  recurringFrequency: 'once' | 'monthly' | 'annually';
}

export interface VolunteerApplication {
  id: number;
  campaignId: number;
  campaignTitle: string;
  name: string;
  email: string;
  skills: string[];
  status: 'pending' | 'approved' | 'rejected';
  appliedDate: string;
}

export interface BeneficiaryRequest {
  id: number;
  beneficiaryName: string;
  beneficiaryEmail: string;
  title: string;
  description: string;
  requestedAmount: number;
  status: 'pending' | 'approved' | 'rejected';
  supportingDocuments: string[];
  createdDate: string;
}

export interface CharityEvent {
  id: number;
  title: string;
  date: string;
  location: string;
  description: string;
  volunteersNeeded: number;
  registeredCount: number;
  registeredVolunteers: string[]; // emails
}

@Injectable({
  providedIn: 'root'
})
export class StateService {
  // Signals for state
  campaigns = signal<Campaign[]>([]);
  donations = signal<Donation[]>([]);
  applications = signal<VolunteerApplication[]>([]);
  beneficiaryRequests = signal<BeneficiaryRequest[]>([]);
  events = signal<CharityEvent[]>([]);

  // Donation Modal Overlay Signals
  isDonationModalOpen = signal(false);
  donationCampaignId = signal<number | null>(null);

  openDonationModal(campaignId: number) {
    this.donationCampaignId.set(campaignId);
    this.isDonationModalOpen.set(true);
  }

  closeDonationModal() {
    this.isDonationModalOpen.set(false);
    this.donationCampaignId.set(null);
  }

  private readonly STORAGE_KEY_CAMPAIGNS = 'charity_campaigns';
  private readonly STORAGE_KEY_DONATIONS = 'charity_donations';
  private readonly STORAGE_KEY_APPLICATIONS = 'charity_applications';
  private readonly STORAGE_KEY_BENEFICIARY_REQS = 'charity_beneficiary_reqs';
  private readonly STORAGE_KEY_EVENTS = 'charity_events';

  private initialCampaigns: Campaign[] = [
    {
      id: 1,
      title: 'Clean Water for Rural Villages',
      description: 'Building modern borehole water wells and filtration systems to provide safe drinking water to over 10,000 residents facing severe water-borne illness crises.',
      category: 'Water & Sanitation',
      targetAmount: 25000,
      currentAmount: 18450,
      deadline: '2026-08-31',
      mediaUrl: 'https://images.unsplash.com/photo-1541913496-52c6f1406437?w=800&auto=format&fit=crop&q=80',
      status: 'active',
      createdDate: '2026-01-10',
      donorCount: 142,
      volunteersCount: 15,
      updates: [
        { id: 1, date: '2026-03-01', content: 'Completed site assessments for three wells in the Northern Sector.' },
        { id: 2, date: '2026-04-15', content: 'First shipment of drilling equipment has arrived safely at the staging hub.' }
      ]
    },
    {
      id: 2,
      title: 'Digital Classrooms for Rural Schools',
      description: 'Equipping rural elementary schools with solar-powered computer labs, tablets, offline educational content, and digital literacy training workshops for local teachers.',
      category: 'Education',
      targetAmount: 15000,
      currentAmount: 9200,
      deadline: '2026-07-15',
      mediaUrl: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=800&auto=format&fit=crop&q=80',
      status: 'active',
      createdDate: '2026-02-05',
      donorCount: 88,
      volunteersCount: 8,
      updates: [
        { id: 1, date: '2026-04-20', content: 'Finished power grid assessment. Solar setup will begin early next month!' }
      ]
    },
    {
      id: 3,
      title: 'Mobile Emergency Feeding Clinic',
      description: 'Deploying a high-capacity mobile kitchen truck to distribute healthy, hot meals and nutritional supplements directly to displaced families in high-poverty regions.',
      category: 'Food Security',
      targetAmount: 40000,
      currentAmount: 32000,
      deadline: '2026-06-30',
      mediaUrl: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&auto=format&fit=crop&q=80',
      status: 'active',
      createdDate: '2026-01-20',
      donorCount: 310,
      volunteersCount: 22,
      updates: [
        { id: 1, date: '2026-02-14', content: 'Delivered our 5,000th meal in district B. Thank you to our amazing donors!' }
      ]
    },
    {
      id: 4,
      title: 'Urgent Disaster Relief Fund',
      description: 'Providing food, clean water, tents, medical kits, and sanitation supplies immediately to families displaced by the recent devastating regional floods.',
      category: 'Disaster Relief',
      targetAmount: 50000,
      currentAmount: 12500,
      deadline: '2026-09-30',
      mediaUrl: 'https://images.unsplash.com/photo-1594708767771-a7502209ff51?w=800&auto=format&fit=crop&q=80',
      status: 'active',
      createdDate: '2026-05-10',
      donorCount: 95,
      volunteersCount: 35,
      updates: []
    }
  ];

  private initialDonations: Donation[] = [
    { id: 1, campaignId: 1, campaignTitle: 'Clean Water for Rural Villages', amount: 500, date: '2026-05-20', donorName: 'Bill Gates', paymentMethod: 'Card', status: 'completed', isRecurring: false, recurringFrequency: 'once' },
    { id: 2, campaignId: 2, campaignTitle: 'Digital Classrooms for Rural Schools', amount: 150, date: '2026-05-22', donorName: 'Sarah Connor', paymentMethod: 'Mobile Money', status: 'completed', isRecurring: true, recurringFrequency: 'monthly' },
    { id: 3, campaignId: 3, campaignTitle: 'Mobile Emergency Feeding Clinic', amount: 1000, date: '2026-05-23', donorName: 'Anonymous', paymentMethod: 'Bank Transfer', status: 'completed', isRecurring: false, recurringFrequency: 'once' },
    { id: 4, campaignId: 1, campaignTitle: 'Clean Water for Rural Villages', amount: 50, date: '2026-05-24', donorName: 'David Beckham', paymentMethod: 'Wallet', status: 'completed', isRecurring: true, recurringFrequency: 'monthly' }
  ];

  private initialApplications: VolunteerApplication[] = [
    { id: 1, campaignId: 1, campaignTitle: 'Clean Water for Rural Villages', name: 'David Beckham', email: 'david.volunteer@gmail.com', skills: ['Logistics', 'Construction'], status: 'approved', appliedDate: '2026-05-15' },
    { id: 2, campaignId: 2, campaignTitle: 'Digital Classrooms for Rural Schools', name: 'Alice Smith', email: 'alice@gmail.com', skills: ['Teaching', 'Computers'], status: 'pending', appliedDate: '2026-05-24' }
  ];

  private initialRequests: BeneficiaryRequest[] = [
    { id: 1, beneficiaryName: 'Jane Doe', beneficiaryEmail: 'jane.help@gmail.com', title: 'Medical Support for Surgery', description: 'Requesting financial assistance for a reconstructive leg surgery following a traffic accident. The total cost is beyond my savings.', requestedAmount: 5000, status: 'approved', supportingDocuments: ['medical_report.pdf', 'hospital_invoice.png'], createdDate: '2026-05-12' },
    { id: 2, beneficiaryName: 'John Doe', beneficiaryEmail: 'john.coop@gmail.com', title: 'Community Farm Seed Capital', description: 'Requesting funds to buy organic seeds and drip irrigation hoses for a local cooperative farming project supplying 20 vulnerable families.', requestedAmount: 2200, status: 'pending', supportingDocuments: ['project_plan.pdf', 'budget_estimate.xlsx'], createdDate: '2026-05-23' }
  ];

  private initialEvents: CharityEvent[] = [
    { id: 1, title: 'Clean Water Project Logistics Day', date: '2026-06-10', location: 'Central Supply Depot', description: 'Sorting filters and pipes to be dispatched to construction sites.', volunteersNeeded: 10, registeredCount: 2, registeredVolunteers: ['david.volunteer@gmail.com'] },
    { id: 2, title: 'Emergency Food Package Sorting', date: '2026-06-15', location: 'Community Center Gym', description: 'Help package dry grains and canned foods for mobile feeding trucks.', volunteersNeeded: 25, registeredCount: 0, registeredVolunteers: [] }
  ];

  constructor() {
    this.loadState();

    // Set up effects to automatically sync changes to localStorage
    effect(() => {
      localStorage.setItem(this.STORAGE_KEY_CAMPAIGNS, JSON.stringify(this.campaigns()));
    });
    effect(() => {
      localStorage.setItem(this.STORAGE_KEY_DONATIONS, JSON.stringify(this.donations()));
    });
    effect(() => {
      localStorage.setItem(this.STORAGE_KEY_APPLICATIONS, JSON.stringify(this.applications()));
    });
    effect(() => {
      localStorage.setItem(this.STORAGE_KEY_BENEFICIARY_REQS, JSON.stringify(this.beneficiaryRequests()));
    });
    effect(() => {
      localStorage.setItem(this.STORAGE_KEY_EVENTS, JSON.stringify(this.events()));
    });
  }

  private loadState() {
    const rawCampaigns = localStorage.getItem(this.STORAGE_KEY_CAMPAIGNS);
    const rawDonations = localStorage.getItem(this.STORAGE_KEY_DONATIONS);
    const rawApplications = localStorage.getItem(this.STORAGE_KEY_APPLICATIONS);
    const rawRequests = localStorage.getItem(this.STORAGE_KEY_BENEFICIARY_REQS);
    const rawEvents = localStorage.getItem(this.STORAGE_KEY_EVENTS);

    this.campaigns.set(rawCampaigns ? JSON.parse(rawCampaigns) : this.initialCampaigns);
    this.donations.set(rawDonations ? JSON.parse(rawDonations) : this.initialDonations);
    this.applications.set(rawApplications ? JSON.parse(rawApplications) : this.initialApplications);
    this.beneficiaryRequests.set(rawRequests ? JSON.parse(rawRequests) : this.initialRequests);
    this.events.set(rawEvents ? JSON.parse(rawEvents) : this.initialEvents);
  }

  // --- Campaign Methods ---
  addCampaign(title: string, description: string, targetAmount: number, deadline: string, category: string, mediaUrl?: string) {
    const newCamp: Campaign = {
      id: Date.now(),
      title,
      description,
      category,
      targetAmount,
      currentAmount: 0,
      deadline,
      mediaUrl: mediaUrl || 'https://images.unsplash.com/photo-1469571486040-7530d97d78ee?w=800&auto=format&fit=crop&q=80',
      status: 'pending', // Admins will need to approve new campaigns if created by managers
      createdDate: new Date().toISOString().split('T')[0],
      donorCount: 0,
      volunteersCount: 0,
      updates: []
    };
    this.campaigns.update(c => [...c, newCamp]);
    return newCamp;
  }

  updateCampaignStatus(campaignId: number, status: 'active' | 'closed' | 'pending') {
    this.campaigns.update(list =>
      list.map(c => c.id === campaignId ? { ...c, status } : c)
    );
  }

  addCampaignUpdate(campaignId: number, content: string) {
    const newUpdate: CampaignUpdate = {
      id: Date.now(),
      date: new Date().toISOString().split('T')[0],
      content
    };
    this.campaigns.update(list =>
      list.map(c => c.id === campaignId ? { ...c, updates: [newUpdate, ...c.updates] } : c)
    );
  }

  // --- Donation Methods ---
  addDonation(campaignId: number, amount: number, paymentMethod: string, isRecurring: boolean, recurringFrequency: 'once' | 'monthly' | 'annually', donorName?: string) {
    const campaign = this.campaigns().find(c => c.id === campaignId);
    if (!campaign) return null;

    const newDonation: Donation = {
      id: Date.now(),
      campaignId,
      campaignTitle: campaign.title,
      amount,
      date: new Date().toISOString().split('T')[0],
      donorName: donorName || 'Anonymous',
      paymentMethod,
      status: 'completed',
      isRecurring,
      recurringFrequency
    };

    // Update donations
    this.donations.update(d => [newDonation, ...d]);

    // Update campaign metrics
    this.campaigns.update(list =>
      list.map(c => {
        if (c.id === campaignId) {
          const isNewDonor = !this.donations().some(d => d.campaignId === campaignId && d.donorName === newDonation.donorName);
          return {
            ...c,
            currentAmount: c.currentAmount + amount,
            donorCount: c.donorCount + (isNewDonor ? 1 : 0)
          };
        }
        return c;
      })
    );

    return newDonation;
  }

  refundDonation(donationId: number) {
    const donation = this.donations().find(d => d.id === donationId);
    if (!donation || donation.status === 'refunded') return;

    this.donations.update(list =>
      list.map(d => d.id === donationId ? { ...d, status: 'refunded' } : d)
    );

    // Deduct from campaign
    this.campaigns.update(list =>
      list.map(c => {
        if (c.id === donation.campaignId) {
          return {
            ...c,
            currentAmount: Math.max(0, c.currentAmount - donation.amount)
          };
        }
        return c;
      })
    );
  }

  // --- Volunteer Applications ---
  applyAsVolunteer(campaignId: number, name: string, email: string, skills: string[]) {
    const campaign = this.campaigns().find(c => c.id === campaignId);
    if (!campaign) return null;

    const newApp: VolunteerApplication = {
      id: Date.now(),
      campaignId,
      campaignTitle: campaign.title,
      name,
      email,
      skills,
      status: 'pending',
      appliedDate: new Date().toISOString().split('T')[0]
    };

    this.applications.update(list => [...list, newApp]);
    return newApp;
  }

  approveVolunteerApplication(applicationId: number) {
    const app = this.applications().find(a => a.id === applicationId);
    if (!app || app.status === 'approved') return;

    this.applications.update(list =>
      list.map(a => a.id === applicationId ? { ...a, status: 'approved' } : a)
    );

    // Increment volunteers count on the campaign
    this.campaigns.update(list =>
      list.map(c => c.id === app.campaignId ? { ...c, volunteersCount: c.volunteersCount + 1 } : c)
    );
  }

  rejectVolunteerApplication(applicationId: number) {
    this.applications.update(list =>
      list.map(a => a.id === applicationId ? { ...a, status: 'rejected' } : a)
    );
  }

  // --- Beneficiary Requests ---
  requestHelp(beneficiaryName: string, beneficiaryEmail: string, title: string, description: string, requestedAmount: number, documents: string[]) {
    const newReq: BeneficiaryRequest = {
      id: Date.now(),
      beneficiaryName,
      beneficiaryEmail,
      title,
      description,
      requestedAmount,
      status: 'pending',
      supportingDocuments: documents.length > 0 ? documents : ['application_letter.pdf'],
      createdDate: new Date().toISOString().split('T')[0]
    };

    this.beneficiaryRequests.update(list => [...list, newReq]);
    return newReq;
  }

  updateBeneficiaryRequestStatus(requestId: number, status: 'approved' | 'rejected') {
    this.beneficiaryRequests.update(list =>
      list.map(r => r.id === requestId ? { ...r, status } : r)
    );

    // If approved, create a new Campaign automatically based on the request so funds can be raised!
    const req = this.beneficiaryRequests().find(r => r.id === requestId);
    if (req && status === 'approved') {
      const existingCamp = this.campaigns().find(c => c.title === req.title);
      if (!existingCamp) {
        this.addCampaign(
          req.title,
          `Beneficiary Assistance Campaign: ${req.description}`,
          req.requestedAmount,
          new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 90 days from now
          'Direct Assistance',
          'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=800&auto=format&fit=crop&q=80'
        );
        // Automatically make it active since it is approved
        const latestCamp = this.campaigns()[this.campaigns().length - 1];
        if (latestCamp) {
          this.updateCampaignStatus(latestCamp.id, 'active');
        }
      }
    }
  }

  // --- Event Methods ---
  addEvent(title: string, date: string, location: string, description: string, volunteersNeeded: number) {
    const newEvent: CharityEvent = {
      id: Date.now(),
      title,
      date,
      location,
      description,
      volunteersNeeded,
      registeredCount: 0,
      registeredVolunteers: []
    };
    this.events.update(list => [...list, newEvent]);
    return newEvent;
  }

  registerForEvent(eventId: number, volunteerEmail: string) {
    this.events.update(list =>
      list.map(ev => {
        if (ev.id === eventId) {
          if (ev.registeredVolunteers.includes(volunteerEmail)) return ev;
          return {
            ...ev,
            registeredCount: ev.registeredCount + 1,
            registeredVolunteers: [...ev.registeredVolunteers, volunteerEmail]
          };
        }
        return ev;
      })
    );
  }
}
