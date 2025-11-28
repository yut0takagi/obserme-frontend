
import { Task, Application, CalendarEvent, DiaryEntry, Course, CourseDocument } from '../types';

// Helper to generate dates relative to today
const getDate = (offset: number) => {
  const d = new Date();
  d.setDate(d.getDate() - offset);
  return d.toISOString().split('T')[0];
};

export const mockApplications: Application[] = [
  { 
    id: '1', 
    company: 'テックコープ', 
    position: 'フロントエンドインターン', 
    status: '一次面接', 
    updatedAt: '2023-11-10',
    startDate: getDate(30),
    endDate: getDate(-10),
    memos: [
      {
        id: 'm1',
        type: '面接',
        title: '一次面接対策',
        content: '技術的な質問の準備をする。\nReactのHooksについて復習が必要。\n\n聞かれそうなこと:\n- なぜReactなのか？\n- 状態管理は何を使ったことがあるか？',
        createdAt: '2023-11-09'
      }
    ]
  },
  { 
    id: '2', 
    company: 'イノベート株式会社', 
    position: 'ジュニアエンジニア', 
    status: '書類選考', 
    updatedAt: '2023-11-01',
    startDate: getDate(40),
    endDate: getDate(10),
    memos: [
      {
        id: 'm2',
        type: 'その他',
        title: '連絡待ちメモ',
        content: '返信待ち。ポートフォリオのリンクが切れていないか確認済。',
        createdAt: '2023-11-01'
      }
    ]
  },
  { 
    id: '3', 
    company: 'スタートアップX', 
    position: 'フルスタックエンジニア', 
    status: '内定', 
    updatedAt: '2023-10-25',
    startDate: getDate(60),
    endDate: getDate(0),
    memos: [
      {
        id: 'm3',
        type: 'その他',
        title: '内定承諾検討',
        content: '来週までに承諾の連絡！給与条件の確認。\nオファー面談で福利厚生について聞く。',
        createdAt: '2023-10-25'
      }
    ]
  },
];

export const mockCourses: Course[] = [
  { id: 'c1', name: 'アルゴリズム論', professor: '鈴木 一郎', dayOfWeek: '月', period: 2, credits: 2, room: '301教室', color: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200' },
  { id: 'c2', name: 'データベース基礎', professor: '田中 花子', dayOfWeek: '火', period: 3, credits: 2, room: 'PC室1', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200' },
  { id: 'c3', name: 'ソフトウェア工学', professor: '佐藤 健', dayOfWeek: '水', period: 1, credits: 2, room: '205教室', color: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200' },
  { id: 'c4', name: '人工知能概論', professor: '高橋 誠', dayOfWeek: '木', period: 4, credits: 2, room: '大講義室', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-200' },
  { id: 'c5', name: '英語コミュニケーション', professor: 'Smith J.', dayOfWeek: '金', period: 2, credits: 1, room: 'CALL教室', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-200' },
];

export const mockTasks: Task[] = [
  // テックコープ関連
  { id: '101', applicationId: '1', title: '企業研究', category: '就活', startDate: '2023-10-15', dueDate: '2023-10-20', status: '完了', priority: '高' },
  { id: '1', applicationId: '1', title: 'ポートフォリオの更新', category: '就活', startDate: '2023-11-01', dueDate: '2023-11-15', status: '進行中', priority: '高' },
  { id: '102', applicationId: '1', title: '面接練習（技術）', category: '就活', dueDate: '2023-11-16', status: '未着手', priority: '高' },
  
  // イノベート株式会社関連
  { id: '201', applicationId: '2', title: 'ES作成', category: '就活', startDate: '2023-10-25', dueDate: '2023-10-30', status: '完了', priority: '中' },
  
  // 大学関連 (courseId紐付け)
  { id: '2', courseId: 'c1', title: 'ソートアルゴリズムのレポート', category: '学習', startDate: '2023-11-10', dueDate: '2023-11-20', status: '未着手', priority: '高' },
  { id: '4', courseId: 'c3', title: '設計パターンの予習', category: '学習', dueDate: '2023-11-14', status: '未着手', priority: '中' },
  
  // 生活
  { id: '3', title: '日用品の買い物', category: '生活', dueDate: '2023-11-12', status: '完了', priority: '低' },
];

export const mockCourseDocuments: CourseDocument[] = [
  { id: 'd1', courseId: 'c1', title: '第1回 講義資料.pdf', type: 'PDF', uploadDate: '2023-10-01', isIndexed: true, summary: 'アルゴリズムの計算量（O記法）についての解説。' },
  { id: 'd2', courseId: 'c1', title: '第2回 ソートアルゴリズム.pdf', type: 'PDF', uploadDate: '2023-10-08', isIndexed: true, summary: 'バブルソート、クイックソートの実装例と効率比較。' },
  { id: 'd3', courseId: 'c2', title: '正規化について.txt', type: 'Text', uploadDate: '2023-10-15', isIndexed: false },
  { id: 'd4', courseId: 'c4', title: '参考リンク集', type: 'Link', uploadDate: '2023-10-20', isIndexed: true, url: 'https://example.com/ai-resources', summary: '機械学習の基礎が学べるWebサイト一覧。' },
];

export const mockEvents: CalendarEvent[] = [
  { id: '1', title: 'テックコープ面接', date: '2023-11-16', time: '14:00', type: '面接' },
  { id: '2', title: '課題提出', date: '2023-11-20', time: '23:59', type: '締切' },
  { id: '3', title: '佐藤さんとランチ', date: '2023-11-18', time: '12:30', type: 'プライベート' },
];

export const mockDiaryEntries: DiaryEntry[] = [
  { id: '1', date: getDate(13), moodScore: 60, content: '就活開始。少し不安だけど頑張ろう。', tags: ['就活', '開始'] },
  { id: '2', date: getDate(12), moodScore: 50, content: 'ESの書き方がわからない。先輩に相談してみる。', tags: ['悩み'] },
  { id: '3', date: getDate(10), moodScore: 75, content: '先輩からのアドバイスで道筋が見えてきた！', tags: ['学習', '気づき'] },
  { id: '4', date: getDate(8), moodScore: 40, content: '模擬面接で失敗して落ち込む。準備不足だった。', tags: ['反省'] },
  { id: '5', date: getDate(7), moodScore: 65, content: '気を取り直してコーディングテストの勉強。解けるようになってきた。', tags: ['学習', '回復'] },
  { id: '6', date: getDate(5), moodScore: 80, content: 'テックコープの書類通過！嬉しい！', tags: ['就活', '成功'] },
  { id: '7', date: getDate(3), moodScore: 85, content: '面接練習がうまくいった。自信がついた。', tags: ['成長'] },
  { id: '8', date: getDate(1), moodScore: 70, content: '明日は面接本番。緊張するけどベストを尽くす。', tags: ['緊張', '準備'] },
];
