import { Injectable, signal } from '@angular/core';

export type UserRole =
  | 'super-admin'
  | 'admin'
  | 'finance-officer'
  | 'campaign-manager'
  | 'volunteer'
  | 'donor'
  | 'beneficiary'
  | 'guest';

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly defaultUsers: Record<UserRole, User> = {
    'super-admin': { 
      id: 1, 
      name: 'Alex Johnson', 
      email: 'alex.admin@charity.org', 
      role: 'super-admin', 
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80' 
    },
    'admin': { 
      id: 2, 
      name: 'Sarah Connor', 
      email: 'sarah.ops@charity.org', 
      role: 'admin', 
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80' 
    },
    'finance-officer': { 
      id: 3, 
      name: 'Robert Kiyosaki', 
      email: 'robert.finance@charity.org', 
      role: 'finance-officer', 
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80' 
    },
    'campaign-manager': { 
      id: 4, 
      name: 'Emma Watson', 
      email: 'emma.campaign@charity.org', 
      role: 'campaign-manager', 
      avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=80' 
    },
    'volunteer': { 
      id: 5, 
      name: 'David Beckham', 
      email: 'david.volunteer@gmail.com', 
      role: 'volunteer', 
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80' 
    },
    'donor': { 
      id: 6, 
      name: 'Bill Gates', 
      email: 'bill.donor@gatesfoundation.org', 
      role: 'donor', 
      avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80' 
    },
    'beneficiary': { 
      id: 7, 
      name: 'Jane Doe', 
      email: 'jane.help@gmail.com', 
      role: 'beneficiary', 
      avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80' 
    },
    'guest': { 
      id: 8, 
      name: 'Anonymous Visitor', 
      email: 'guest@charity.org', 
      role: 'guest', 
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80' 
    }
  };

  currentUser = signal<User>(this.defaultUsers['guest']);

  setRole(role: UserRole) {
    this.currentUser.set(this.defaultUsers[role]);
  }

  logout() {
    this.currentUser.set(this.defaultUsers['guest']);
  }
}
