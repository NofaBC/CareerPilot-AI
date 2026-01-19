export interface UserProfile {
  skills: string[];
  experienceYears: number;
  targetRoles: string[];
  locationPreference: string;
}

export interface JobPosting {
  id: string;
  title: string;
  description: string;
  requiredSkills: string[];
  experienceRequired?: number;
  location: string;
}

export interface FitScoreResult {
  score: number;
  explanation: string;
  breakdown: {
    skillsMatch: number;
    roleMatch: number;
    experienceMatch: number;
    locationMatch: number;
  };
}

export class ScoringService {
  public static calculateFitScore(profile: UserProfile, job: JobPosting): FitScoreResult {
    const skillsMatch = this.calculateSkillsMatch(profile.skills, job.requiredSkills, job.description);
    const roleMatch = this.calculateRoleMatch(profile.targetRoles, job.title);
    const experienceMatch = this.calculateExperienceMatch(profile.experienceYears, job.experienceRequired);
    const locationMatch = this.calculateLocationMatch(profile.locationPreference, job.location);

    const weightedScore = (skillsMatch * 0.4) + (roleMatch * 0.3) + (experienceMatch * 0.2) + (locationMatch * 0.1);
    const score = Math.round(weightedScore);

    return {
      score,
      explanation: this.generateExplanation(score),
      breakdown: { skillsMatch, roleMatch, experienceMatch, locationMatch }
    };
  }

  private static calculateSkillsMatch(userSkills: string[], jobSkills: string[], description: string): number {
    if (jobSkills.length === 0) return 70;
    const matchedSkills = jobSkills.filter(skill => 
      userSkills.some(userSkill => userSkill.toLowerCase() === skill.toLowerCase()) ||
      description.toLowerCase().includes(skill.toLowerCase())
    );
    return Math.min(100, (matchedSkills.length / jobSkills.length) * 100);
  }

  private static calculateRoleMatch(targetRoles: string[], jobTitle: string): number {
    const isMatch = targetRoles.some(role => jobTitle.toLowerCase().includes(role.toLowerCase()));
    return isMatch ? 100 : 40;
  }

  private static calculateExperienceMatch(userExp: number, jobExp?: number): number {
    if (!jobExp) return 100;
    return userExp >= jobExp ? 100 : 70;
  }

  private static calculateLocationMatch(userLoc: string, jobLoc: string): number {
    if (userLoc.toLowerCase() === 'remote' || jobLoc.toLowerCase().includes('remote')) return 100;
    return jobLoc.toLowerCase().includes(userLoc.toLowerCase().split(',')[0].trim().toLowerCase()) ? 100 : 50;
  }

  private static generateExplanation(score: number): string {
    if (score >= 85) return "Excellent match! Your leadership and acute care experience align perfectly.";
    if (score >= 70) return "Strong match. Your background in Chicago hospital systems is a key asset.";
    return "Good potential. This role matches your target location and core nursing skills.";
  }
}
