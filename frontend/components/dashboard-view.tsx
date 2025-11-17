import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Calendar, MessageSquare, FileText, Sparkles, PenLine, TrendingUp, Target } from 'lucide-react'

const todayHighlights = [
  { type: 'calendar', title: '企業説明会', time: '14:00', company: 'テック株式会社' },
  { type: 'ai', title: 'キャリアの方向性について', time: '10:30', summary: 'データサイエンスとプロダクトマネジメントの比較' },
  { type: 'diary', title: '今日の振り返り', time: '22:00', content: 'チーム開発で新しい技術スタックに挑戦した' },
]

const jobApplications = [
  { company: 'サイバーエージェント', stage: 'ES提出済み', status: 'pending', date: '2025/11/20' },
  { company: 'メルカリ', stage: '一次面接', status: 'scheduled', date: '2025/11/25' },
  { company: 'LINE', stage: '最終面接', status: 'scheduled', date: '2025/12/01' },
]

const recentTopics = [
  { title: 'プロダクト開発の振り返り', tags: ['開発', '成長'], date: '2日前' },
  { title: 'ESブラッシュアップ', tags: ['就活', '自己分析'], date: '3日前' },
  { title: 'データ構造の学習ノート', tags: ['学習', 'CS'], date: '5日前' },
]

export function DashboardView() {
  return (
    <div className="h-full overflow-auto">
      <div className="container mx-auto p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">ダッシュボード</h1>
          <p className="text-muted-foreground">
            今日も一歩ずつ、あなたの成長を記録しましょう
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Today's Snapshot */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  今日のスナップショット
                </h2>
                <span className="text-sm text-muted-foreground">2025年11月17日</span>
              </div>

              <div className="space-y-4">
                {todayHighlights.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-4 p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      {item.type === 'calendar' && <Calendar className="h-5 w-5 text-primary" />}
                      {item.type === 'ai' && <MessageSquare className="h-5 w-5 text-accent" />}
                      {item.type === 'diary' && <FileText className="h-5 w-5 text-chart-3" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-medium text-foreground">{item.title}</h3>
                        <span className="text-xs text-muted-foreground whitespace-nowrap">{item.time}</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {item.type === 'calendar' && item.company}
                        {item.type === 'ai' && item.summary}
                        {item.type === 'diary' && item.content}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Job/Career Widget */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  就活・キャリア
                </h2>
                <Button variant="ghost" size="sm" asChild>
                  <a href="/career">すべて見る</a>
                </Button>
              </div>

              <div className="space-y-3">
                {jobApplications.map((app, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 rounded-lg border border-border hover:border-primary/50 transition-colors"
                  >
                    <div className="flex-1">
                      <h3 className="font-medium text-foreground mb-1">{app.company}</h3>
                      <div className="flex items-center gap-2">
                        <Badge variant={app.status === 'scheduled' ? 'default' : 'secondary'}>
                          {app.stage}
                        </Badge>
                        <span className="text-xs text-muted-foreground">{app.date}</span>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" asChild>
                      <a href="/career">詳細</a>
                    </Button>
                  </div>
                ))}
              </div>
            </Card>

            {/* Recent Topics */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                最近のトピック
              </h2>
              <div className="space-y-3">
                {recentTopics.map((topic, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div>
                      <h3 className="font-medium text-foreground mb-1">{topic.title}</h3>
                      <div className="flex gap-2">
                        {topic.tags.map((tag) => (
                          <span key={tag} className="text-xs px-2 py-0.5 rounded bg-primary/10 text-primary">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground">{topic.date}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* AI Assistant Widget */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-accent" />
                AIアシスタント
              </h2>
              
              <div className="space-y-3 mb-4">
                <Button 
                  variant="outline" 
                  className="w-full justify-start text-sm h-auto py-3 px-4 hover:bg-primary/10 hover:text-primary hover:border-primary"
                >
                  <span className="text-left">今日の出来事を要約して日記にして</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start text-sm h-auto py-3 px-4 hover:bg-primary/10 hover:text-primary hover:border-primary"
                >
                  <span className="text-left">この1週間の頑張りをES向けに整理して</span>
                </Button>
              </div>

              <Button className="w-full">
                <MessageSquare className="h-4 w-4 mr-2" />
                AIと相談する
              </Button>
            </Card>

            {/* Quick Actions */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">クイックアクション</h2>
              <div className="space-y-2">
                <Button variant="secondary" className="w-full justify-start">
                  <PenLine className="h-4 w-4 mr-2" />
                  日記を書く
                </Button>
                <Button variant="secondary" className="w-full justify-start">
                  <Sparkles className="h-4 w-4 mr-2" />
                  今日のログを要約
                </Button>
                <Button variant="secondary" className="w-full justify-start">
                  <FileText className="h-4 w-4 mr-2" />
                  ESのブラッシュアップ
                </Button>
              </div>
            </Card>

            {/* Stats Card */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">今週の活動</h2>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">AI対話</span>
                    <span className="font-medium">12回</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary w-3/4"></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">日記</span>
                    <span className="font-medium">5件</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-accent w-4/5"></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">資料整理</span>
                    <span className="font-medium">8件</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-chart-3 w-2/3"></div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
