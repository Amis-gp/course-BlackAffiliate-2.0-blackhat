export interface Announcement {
  id: string;
  title: string;
  content: string;
  image_url?: string;
  created_at: string;
  created_by: string;
  updated_at?: string;
  is_edited?: boolean;
}

export interface UserReadAnnouncement {
  id: string;
  user_id: string;
  announcement_id: string;
  read_at: string;
}

export interface AnnouncementWithReadStatus extends Announcement {
  is_read: boolean;
  read_count?: number;
  total_users?: number;
}

export interface CreateAnnouncementRequest {
  title: string;
  content: string;
  image_url?: string;
}

export interface UpdateAnnouncementRequest {
  title: string;
  content: string;
  image_url?: string;
}

