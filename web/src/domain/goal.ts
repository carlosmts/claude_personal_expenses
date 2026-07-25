export interface Goal {
  id: number;
  /** null means a shared/household goal, not owned by one person. */
  userId: number | null;
  userName: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
}

export interface GoalInput {
  userId: number | null;
  name: string;
  targetAmount: number;
  currentAmount: number;
}
