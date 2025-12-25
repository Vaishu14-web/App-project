
import React from 'react';
import { ExcuseCategory } from './types';

export const CATEGORIES: ExcuseCategory[] = [
  { 
    id: 'late', 
    label: 'Late', 
    icon: '⏰', 
    promptHint: 'being late to work or a social gathering' 
  },
  { 
    id: 'homework', 
    label: 'Homework', 
    icon: '📚', 
    promptHint: 'missing a homework assignment or a project deadline' 
  },
  { 
    id: 'forgot_name', 
    label: 'Forgot Name', 
    icon: '🤔', 
    promptHint: 'forgetting someone\'s name during a conversation' 
  },
  { 
    id: 'ignored_message', 
    label: 'No Reply', 
    icon: '📱', 
    promptHint: 'not replying to a text message for a long time' 
  },
  { 
    id: 'social_escape', 
    label: 'Escape', 
    icon: '🏃', 
    promptHint: 'needing to leave a boring social event early' 
  }
];

export const MOCK_EXCUSES = [
  "My cat accidentally scheduled a mandatory yoga session for me and I couldn't find the 'cancel' button on her paws.",
  "I was ready to leave, but then I realized I was wearing two different shoes, and they started arguing about which direction to walk first.",
  "I got caught in a localized temporal anomaly where time moves 50% slower, but only in my kitchen."
];
