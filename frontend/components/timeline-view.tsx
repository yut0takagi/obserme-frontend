'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Search, Calendar, MessageSquare, FileText, BookOpen, Briefcase, SlidersHorizontal } from 'lucide-react'

const timelineData = [
  {
    date: '2025/11/17',
    items: [
      {
        type: 'ai',
        title: 'AIとのキャリア相談',
        summary: 'データサイエンスとプロダクトマネジメントの違いについて深掘り',
        time: '10:30',
        tags: ['キャリア', '自己分析'],
        source: 'ChatGPT'
      },
      {
        type: 'lecture',
        title: '機械学習の基礎',
        summary: '教師あり学習のアルゴリズムについての講義ノート',
        time: '13:00',
        tags: ['学習', 'ML'],
        source: 'University'
      },
      {
        type: 'diary',
        title: '今日の振り返り',
        summary: 'チーム開発で新しい技術スタックに挑戦。Reactの状態管理について学んだ',
        time: '22:00',
        tags: ['開発', '成長'],
        source: 'ObserMe'
      },
    ]
  },
  {
    date: '2025/11/16',
    items: [
      {
        type: 'job',
        title: 'ES作成: サイバーエージェント',
        summary: '「学生時代に最も力を入れたこと」の内容をAIでブラッシュアップ',
        time: '15:00',
        tags: ['就活', 'ES'],
        source: 'ObserMe'
      },
      {
        type: 'ai',
        title: 'グループディスカッション対策',
        summary: 'ケース面接の解法パターンについて質問',
        time: '18:30',
        tags: ['就活', '面接'],
        source: 'ChatGPT'
      },
    ]
  },
  {
    date: '2025/11/15',
    items: [
      {
        type: 'lecture',
        title: 'データベース設計',
        summary: '正規化とインデックス設計についての講義',
        time: '10:00',
        tags: ['学習', 'Database'],
        source: 'University'
      },
      {
        type: 'diary',
        title: '企業説明会の感想',
        summary: 'メルカリの説明会に参加。プロダクト開発の文化に興味を持った',
        time: '20:00',
        tags: ['就活', '企業研究'],
        source: 'ObserMe'
      },
    ]
  },
]

const typeIcons = {
  ai: MessageSquare,
  diary: FileText,
  lecture: BookOpen,
  job: Briefcase,
}

const typeColors = {
  ai: 'text-accent',
  diary: 'text-chart-3',
  lecture: 'text-primary',
  job: 'text-chart-4',
}

export function TimelineView() {
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <div className="h-full overflow-auto">
      <div className="container mx-auto p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Timeline</h1>
          <p className="text-muted-foreground">
            あなたの日々の記録を時系列で確認
          </p>
        </div>

        {/* Filter Bar */}
        <Card className="p-4 mb-6">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex-1 min-w-[300px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="キーワードで検索..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Button variant="outline" size="sm">
              <Calendar className="h-4 w-4 mr-2" />
              期間選択
            </Button>
            <Button variant="outline" size="sm">
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              フィルター
            </Button>
          </div>

          <div className="flex gap-2 mt-4">
            <Badge variant="secondary" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">
              すべて
            </Badge>
            <Badge variant="outline" className="cursor-pointer hover:bg-primary/10">
              AI対話
            </Badge>
            <Badge variant="outline" className="cursor-pointer hover:bg-primary/10">
              日記
            </Badge>
            <Badge variant="outline" className="cursor-pointer hover:bg-primary/10">
              講義
            </Badge>
            <Badge variant="outline" className="cursor-pointer hover:bg-primary/10">
              就活
            </Badge>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Timeline Column */}
          <div className="lg:col-span-3 space-y-8">
            {timelineData.map((day, dayIndex) => (
              <div key={dayIndex}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-px flex-1 bg-border"></div>
                  <h2 className="text-sm font-semibold text-muted-foreground">{day.date}</h2>
                  <div className="h-px flex-1 bg-border"></div>
                </div>

                <div className="space-y-4">
                  {day.items.map((item, itemIndex) => {
                    const Icon = typeIcons[item.type as keyof typeof typeIcons]
                    const colorClass = typeColors[item.type as keyof typeof typeColors]

                    return (
                      <Card key={itemIndex} className="p-5 hover:border-primary/50 transition-colors cursor-pointer">
                        <div className="flex gap-4">
                          <div className={`h-12 w-12 rounded-lg bg-muted flex items-center justify-center flex-shrink-0 ${colorClass}`}>
                            <Icon className="h-6 w-6" />
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2 mb-2">
                              <h3 className="font-semibold text-foreground">{item.title}</h3>
                              <span className="text-xs text-muted-foreground whitespace-nowrap">{item.time}</span>
                            </div>
                            
                            <p className="text-sm text-muted-foreground mb-3">
                              {item.summary}
                            </p>

                            <div className="flex items-center justify-between">
                              <div className="flex gap-2">
                                {item.tags.map((tag) => (
                                  <span key={tag} className="text-xs px-2 py-1 rounded bg-primary/10 text-primary">
                                    {tag}
                                  </span>
                                ))}
                              </div>
                              <span className="text-xs text-muted-foreground">{item.source}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="mt-4 pt-4 border-t border-border">
                          <Button variant="ghost" size="sm" className="text-primary hover:text-primary">
                            全文を開く
                          </Button>
                        </div>
                      </Card>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Summary Sidebar */}
          <div className="space-y-6">
            <Card className="p-5">
              <h3 className="font-semibold mb-4">この期間のトピック</h3>
              <div className="space-y-2">
                {['キャリア', '開発', '学習', '就活', '面接'].map((topic, index) => (
                  <div key={topic} className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{topic}</span>
                    <span className="text-xs font-medium px-2 py-1 rounded bg-primary/10 text-primary">
                      {12 - index * 2}件
                    </span>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-5">
              <h3 className="font-semibold mb-4">感情タグ</h3>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">成長実感</Badge>
                <Badge variant="secondary">不安</Badge>
                <Badge variant="secondary">嬉しい</Badge>
                <Badge variant="secondary">学び</Badge>
                <Badge variant="secondary">挑戦</Badge>
              </div>
            </Card>

            <Card className="p-5">
              <h3 className="font-semibold mb-4">統計</h3>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">総記録数</span>
                    <span className="font-medium">47件</span>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">AI対話</span>
                    <span className="font-medium">18件</span>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">日記</span>
                    <span className="font-medium">12件</span>
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
