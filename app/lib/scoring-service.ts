/**
 * CareerPilot AI™: Job Matching and Fit-Scoring Engine
 * 
 * This service calculates a "Fit Score" (0-100%) by comparing a user's career profile
 * against a specific job description.
 */

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
  /**
   * Calculates the overall Fit Score based on weighted categories.
   */
  public static calculateFitScore(profile: UserProfile, job: JobPosting): FitScoreResult {
    const skillsMatch = this.calculateSkillsMatch(profile.skills, job.requiredSkills, job.description);
    const roleMatch = this.calculateRoleMatch(profile.targetRoles, job.title);
    const experienceMatch = this.calculateExperienceMatch(profile.experienceYears, job.experienceRequired);
    const locationMatch = this.calculateLocationMatch(profile.locationPreference, job.location);

    // Weighted Scoring Logic
    // Skills: 40%, Role: 30%, Experience: 20%, Location: 10%
    const weightedScore = (
      (skillsMatch * 0.4) +
      (roleMatch * 0.3) +
      (experienceMatch * 0.2) +
      (locationMatch * 0.1)
    );

    const score = Math.round(weightedScore);
    const explanation = this.generateExplanation(score, skillsMatch, roleMatch);

    return {
      score,
      explanation,
      breakdown: {
        skillsMatch,
        roleMatch,
        experienceMatch,
        locationMatch
      }
    };
  }

  private static calculateSkillsMatch(userSkills: string[], jobSkills: string[], description: string): number {
    if (jobSkills.length === 0) return 70; // Default if no explicit skills listed

    const matchedSkills = jobSkills.filter(skill => 
      userSkills.some(userSkill => userSkill.toLowerCase() === skill.toLowerCase()) ||
      description.toLowerCase().includes(skill.toLowerCase())
    );

    return Math.min(100, (matchedSkills.length / jobSkills.length) * 100);
  }

  private static calculateRoleMatch(targetRoles: string[], jobTitle: string): number {
    const isMatch = targetRoles.some(role => 
      jobTitle.toLowerCase().includes(role.toLowerCase()) ||
      role.toLowerCase().includes(jobTitle.toLowerCase())
    );
    return isMatch ? 100 : 40; // Partial match for role
  }

  private static calculateExperienceMatch(userExp: number, jobExp?: number): number {
    if (!jobExp) return 100;
    if (userExp >= jobExp) return 100;
    if (userExp >= jobExp - 2) return 70; // Close enough
    return 40;
  }

  private static calculateLocationMatch(userLoc: string, jobLoc: string): number {
    if (userLoc.toLowerCase() === 'remote' || jobLoc.toLowerCase().includes('remote')) return 100;
    return userLoc.toLowerCase() === jobLoc.toLowerCase() ? 100 : 50;
  }

  private static generateExplanation(score: number, skillsMatch: number, roleMatch: number): string {
    if (score >= 85) return "Excellent match! Your skills and experience align perfectly with this role.";
    if (score >= 70) return "Strong match. You have the core skills, though some secondary requirements may differ.";
    if (score >= 50) return "Good potential. This role matches your target title, but you may need to highlight specific skills.";
    return "Partial match. Consider how your transferable skills could apply to this specific role.";
  }
}
