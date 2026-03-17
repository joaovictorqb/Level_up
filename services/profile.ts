import { profileRepository } from '@/lib/storage';
import { Profile } from '@/types';

export const profileService = {
  async getProfile(userId: string) {
    return profileRepository.get(userId);
  },

  async updateProfile(userId: string, updates: Partial<Profile>) {
    return profileRepository.update(userId, updates);
  },

  async addXP(userId: string, amount: number) {
    return profileRepository.addXP(userId, amount);
  }
};
