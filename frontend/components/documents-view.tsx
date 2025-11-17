'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Search, FileText, Upload, Grid3X3, List, MoreVertical } from 'lucide-react'

const tabs = ['全て', '講義資料', 'ES / 就活', 'プロジェクト', 'その他']

const documents = [
  {
    title: '機械学習の基礎 - 第5回講義',
    type: '講義資料',
    date: '2025/11/15',
    tags: ['ML', '学習'],
    format: 'PDF'
  },
  {
    title: 'サイバーエージェント - ES草案',
    type: 'ES',
    date: '2025/11/16',
    tags: ['就活', 'ES'],
    format: 'Markdown'
  },
  {
    title: 'チーム開発プロジェクト仕様書',
    type: 'プロジェクト',
    date: '2025/11/10',
    tags: ['開発', 'チーム'],
    format: 'Markdown'
  },
  {
    title: 'データベース設計講義ノート',
    type: '講義資料',
    date: '2025/11/12',
    tags: ['Database', '学習'],
    format: 'Markdown'
  },
  {
    title: 'メルカリ - 企業研究メモ',
    type: 'ES / 就活',
    date: '2025/11/14',
    tags: ['就活', '企業研究'],
    format: 'Markdown'
  },
  {
    title: 'React hooks パターン集',
    type: 'プロジェクト',
    date: '2025/11/08',
    tags: ['React', '開発'],
    format: 'Markdown'
  },
]

export function DocumentsView() {
  const [activeTab, setActiveTab] = useState('全て')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <div className="h-full overflow-auto">
      <div className="container mx-auto p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-3xl font-bold text-foreground">Documents</h1>
            <Button>
              <Upload className="h-4 w-4 mr-2" />
              アップロード
            </Button>
          </div>
          <p className="text-muted-foreground">
            講義資料、ES、プロジェクトファイルを一元管理
          </p>
        </div>

        {/* Tabs & Controls */}
        <Card className="p-4 mb-6">
          <div className="flex items-center justify-between gap-4 mb-4">
            <div className="flex-1">
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="ドキュメントを検索..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="icon"
                onClick={() => setViewMode('grid')}
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="icon"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex gap-2">
            {tabs.map((tab) => (
              <Button
                key={tab}
                variant={activeTab === tab ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </Button>
            ))}
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Documents Grid/List */}
          <div className="lg:col-span-3">
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {documents.map((doc, index) => (
                  <Card key={index} className="p-5 hover:border-primary/50 transition-colors cursor-pointer">
                    <div className="flex items-start justify-between mb-3">
                      <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                        <FileText className="h-6 w-6 text-primary" />
                      </div>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </div>

                    <h3 className="font-semibold text-foreground mb-2 line-clamp-2">
                      {doc.title}
                    </h3>

                    <div className="flex flex-wrap gap-1 mb-3">
                      {doc.tags.map((tag) => (
                        <span key={tag} className="text-xs px-2 py-0.5 rounded bg-primary/10 text-primary">
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{doc.type}</span>
                      <span>{doc.date}</span>
                    </div>

                    <div className="mt-3 pt-3 border-t border-border">
                      <Badge variant="secondary" className="text-xs">
                        {doc.format}
                      </Badge>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {documents.map((doc, index) => (
                  <Card key={index} className="p-4 hover:border-primary/50 transition-colors cursor-pointer">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <FileText className="h-5 w-5 text-primary" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground mb-1">{doc.title}</h3>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">{doc.type}</span>
                          <span className="text-xs text-muted-foreground">•</span>
                          <span className="text-xs text-muted-foreground">{doc.date}</span>
                          <div className="flex gap-1 ml-2">
                            {doc.tags.map((tag) => (
                              <span key={tag} className="text-xs px-2 py-0.5 rounded bg-primary/10 text-primary">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      <Badge variant="secondary" className="text-xs">
                        {doc.format}
                      </Badge>

                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Preview Sidebar */}
          <div className="space-y-6">
            <Card className="p-5">
              <h3 className="font-semibold mb-4">プレビュー</h3>
              <div className="aspect-[3/4] bg-muted rounded-lg flex items-center justify-center mb-4">
                <FileText className="h-12 w-12 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground">
                ドキュメントを選択するとプレビューが表示されます
              </p>
            </Card>

            <Card className="p-5">
              <h3 className="font-semibold mb-4">統計</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">総ドキュメント数</span>
                  <span className="font-medium">24件</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">講義資料</span>
                  <span className="font-medium">8件</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">ES / 就活</span>
                  <span className="font-medium">6件</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">プロジェクト</span>
                  <span className="font-medium">10件</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
