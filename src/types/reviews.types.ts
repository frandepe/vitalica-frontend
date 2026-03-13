export interface ReviewUser {
  name: string;
  avatarUrl: string;
}

export interface PublicReview {
  id: string;
  rating: number;
  comment?: string;
  createdAt: string;
  user: ReviewUser | null;
}

export interface ReviewItemProps {
  review: PublicReview;
}
