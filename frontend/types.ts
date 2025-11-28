
export interface Task {
  id: string;
  applicationId?: string; // どの選考に関連するタスクか
  courseId?: string;      // どの授業に関連するタスク（課題）か
  title: string;
  category: '就活' | '学習' | '生活';
  startDate?: string;     // 開始日 (オプション、期間の場合に使用)
  dueDate: string;        // 期限日 (終了日)
  status: '未着手' | '進行中' | '完了';
  priority: '高' | '中' | '低';
}

export interface ApplicationMemo {
  id: string;
  type: 'ES' | '面接' | 'GD' | 'その他';
  title: string;
  content: string;
  createdAt: string;
}

export interface Application {
  id: string;
  company: string;
  position: string;
  status: '書類選考' | '一次面接' | '最終面接' | '内定' | '不採用';
  updatedAt: string;
  startDate?: string; // ガントチャート用開始日
  endDate?: string;   // ガントチャート用終了日
  memos: ApplicationMemo[];
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  type: '面接' | '締切' | 'プライベート';
}

export interface User {
  name: string;
  email: string;
  school: string;
  graduationYear: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model' | 'system';
  content: string;
  timestamp: string;
  avatar?: string;
  name?: string;
}

export interface DiaryEntry {
  id: string;
  date: string; // YYYY-MM-DD
  content: string;
  moodScore: number; // 0 to 100
  tags?: string[];
}

export interface Course {
  id: string;
  name: string;
  professor: string;
  dayOfWeek: '月' | '火' | '水' | '木' | '金' | '土';
  period: 1 | 2 | 3 | 4 | 5 | 6; // 時限
  credits: number;
  room?: string;
  color?: string; // 表示色
}

export interface CourseDocument {
  id: string;
  courseId: string;
  title: string;
  type: 'PDF' | 'Link' | 'Image' | 'Text';
  url?: string;
  uploadDate: string;
  isIndexed: boolean; // RAG用にインデックス済みかどうか
  summary?: string;   // AIによる要約
}
