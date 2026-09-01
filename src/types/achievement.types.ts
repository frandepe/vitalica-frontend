export type AchievementExperience = "USER" | "INSTRUCTOR";

export type UserAchievementKey =
  | "JOINED_VITALICA"
  | "STARTED_FIRST_COURSE"
  | "COMPLETED_FIRST_COURSE"
  | "COMPLETED_FIRST_PRACTICE"
  | "COMPLETED_THREE_COURSES";

export type InstructorAchievementKey =
  | "JOINED_VITALICA"
  | "BECAME_VERIFIED_INSTRUCTOR"
  | "PUBLISHED_FIRST_COURSE"
  | "RECEIVED_FIRST_STUDENT"
  | "COMPLETED_FIRST_GUIDED_PRACTICE";

export type AchievementKey =
  | UserAchievementKey
  | InstructorAchievementKey;

export interface AchievementMilestoneState {
  key: AchievementKey;
  achieved: boolean;
  achievedAt: string | null;
}

export interface AchievementsData {
  experience: AchievementExperience | null;
  completedCount: number;
  total: number;
  milestones: AchievementMilestoneState[];
}
