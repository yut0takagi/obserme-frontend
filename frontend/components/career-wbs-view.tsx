'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Calendar, ChevronRight, ChevronDown, Plus, MoreHorizontal, Target, CheckCircle2, Circle, Clock, AlertCircle, Filter, Download } from 'lucide-react'

type TaskStatus = 'pending' | 'in-progress' | 'completed' | 'delayed'

interface Task {
  id: string
  title: string
  status: TaskStatus
  startDate: string
  endDate: string
  progress: number
  assignee?: string
  subtasks?: Task[]
}

const companies: Task[] = [
  {
    id: '1',
    title: 'サイバーエージェント',
    status: 'in-progress',
    startDate: '2025/11/01',
    endDate: '2025/12/15',
    progress: 45,
    subtasks: [
      { id: '1-1', title: 'ES作成', status: 'completed', startDate: '2025/11/01', endDate: '2025/11/10', progress: 100 },
      { id: '1-2', title: 'ES提出', status: 'completed', startDate: '2025/11/10', endDate: '2025/11/15', progress: 100 },
      { id: '1-3', title: 'Webテスト受験', status: 'in-progress', startDate: '2025/11/16', endDate: '2025/11/20', progress: 60 },
      { id: '1-4', title: '一次面接準備', status: 'pending', startDate: '2025/11/21', endDate: '2025/11/28', progress: 0 },
      { id: '1-5', title: '一次面接', status: 'pending', startDate: '2025/11/29', endDate: '2025/11/30', progress: 0 },
    ]
  },
  {
    id: '2',
    title: 'メルカリ',
    status: 'in-progress',
    startDate: '2025/11/05',
    endDate: '2025/12/20',
    progress: 70,
    subtasks: [
      { id: '2-1', title: 'ES作成', status: 'completed', startDate: '2025/11/05', endDate: '2025/11/12', progress: 100 },
      { id: '2-2', title: 'ES提出', status: 'completed', startDate: '2025/11/12', endDate: '2025/11/15', progress: 100 },
      { id: '2-3', title: 'コーディングテスト', status: 'completed', startDate: '2025/11/16', endDate: '2025/11/18', progress: 100 },
      { id: '2-4', title: '一次面接', status: 'completed', startDate: '2025/11/20', endDate: '2025/11/21', progress: 100 },
      { id: '2-5', title: '二次面接準備', status: 'in-progress', startDate: '2025/11/22', endDate: '2025/11/25', progress: 40 },
      { id: '2-6', title: '二次面接', status: 'pending', startDate: '2025/11/26', endDate: '2025/11/26', progress: 0 },
    ]
  },
  {
    id: '3',
    title: 'LINE',
    status: 'in-progress',
    startDate: '2025/10/20',
    endDate: '2025/12/05',
    progress: 85,
    subtasks: [
      { id: '3-1', title: 'ES作成', status: 'completed', startDate: '2025/10/20', endDate: '2025/10/28', progress: 100 },
      { id: '3-2', title: 'ES提出', status: 'completed', startDate: '2025/10/28', endDate: '2025/11/01', progress: 100 },
      { id: '3-3', title: '一次面接', status: 'completed', startDate: '2025/11/05', endDate: '2025/11/06', progress: 100 },
      { id: '3-4', title: '二次面接', status: 'completed', startDate: '2025/11/10', endDate: '2025/11/11', progress: 100 },
      { id: '3-5', title: '最終面接準備', status: 'in-progress', startDate: '2025/11/15', endDate: '2025/11/30', progress: 70 },
      { id: '3-6', title: '最終面接', status: 'pending', startDate: '2025/12/01', endDate: '2025/12/01', progress: 0 },
    ]
  },
  {
    id: '4',
    title: 'DeNA',
    status: 'pending',
    startDate: '2025/11/20',
    endDate: '2025/12/30',
    progress: 15,
    subtasks: [
      { id: '4-1', title: 'ES作成', status: 'in-progress', startDate: '2025/11/20', endDate: '2025/11/25', progress: 50 },
      { id: '4-2', title: 'ES提出', status: 'pending', startDate: '2025/11/25', endDate: '2025/11/28', progress: 0 },
    ]
  },
  {
    id: '5',
    title: 'リクルート',
    status: 'pending',
    startDate: '2025/11/25',
    endDate: '2026/01/15',
    progress: 0,
    subtasks: [
      { id: '5-1', title: '企業研究', status: 'pending', startDate: '2025/11/25', endDate: '2025/12/01', progress: 0 },
      { id: '5-2', title: 'ES作成', status: 'pending', startDate: '2025/12/02', endDate: '2025/12/10', progress: 0 },
    ]
  }
]

const statusConfig = {
  pending: { label: '未着手', color: 'bg-muted text-muted-foreground', icon: Circle },
  'in-progress': { label: '進行中', color: 'bg-primary/10 text-primary', icon: Clock },
  completed: { label: '完了', color: 'bg-green-500/10 text-green-500', icon: CheckCircle2 },
  delayed: { label: '遅延', color: 'bg-destructive/10 text-destructive', icon: AlertCircle },
}

export function CareerWBSView() {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set(['1', '2', '3']))
  const [selectedFilter, setSelectedFilter] = useState<'all' | TaskStatus>('all')

  const toggleExpand = (id: string) => {
    const newExpanded = new Set(expandedItems)
    if (newExpanded.has(id)) {
      newExpanded.delete(id)
    } else {
      newExpanded.add(id)
    }
    setExpandedItems(newExpanded)
  }

  const filteredCompanies = selectedFilter === 'all' 
    ? companies 
    : companies.filter(c => c.status === selectedFilter)

  const stats = {
    total: companies.length,
    completed: companies.filter(c => c.status === 'completed').length,
    inProgress: companies.filter(c => c.status === 'in-progress').length,
    pending: companies.filter(c => c.status === 'pending').length,
  }

  return (
    <div className="h-full overflow-auto">
      <div className="container mx-auto p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-3">
                <Target className="h-8 w-8 text-primary" />
                就活・キャリア管理
              </h1>
              <p className="text-muted-foreground">
                WBS形式で就職活動の進捗を可視化・管理
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                エクスポート
              </Button>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                企業を追加
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-4">
            <Card className="p-4">
              <div className="text-sm text-muted-foreground mb-1">総応募数</div>
              <div className="text-2xl font-bold">{stats.total}社</div>
            </Card>
            <Card className="p-4 border-primary/50">
              <div className="text-sm text-muted-foreground mb-1">進行中</div>
              <div className="text-2xl font-bold text-primary">{stats.inProgress}社</div>
            </Card>
            <Card className="p-4">
              <div className="text-sm text-muted-foreground mb-1">未着手</div>
              <div className="text-2xl font-bold">{stats.pending}社</div>
            </Card>
            <Card className="p-4 border-green-500/50">
              <div className="text-sm text-muted-foreground mb-1">完了</div>
              <div className="text-2xl font-bold text-green-500">{stats.completed}社</div>
            </Card>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 mb-6">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Button
            variant={selectedFilter === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedFilter('all')}
          >
            すべて
          </Button>
          <Button
            variant={selectedFilter === 'in-progress' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedFilter('in-progress')}
          >
            進行中
          </Button>
          <Button
            variant={selectedFilter === 'pending' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedFilter('pending')}
          >
            未着手
          </Button>
          <Button
            variant={selectedFilter === 'completed' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedFilter('completed')}
          >
            完了
          </Button>
        </div>

        {/* WBS Table */}
        <Card className="overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-4 p-4 bg-muted/50 border-b border-border font-medium text-sm text-muted-foreground">
            <div className="col-span-4">タスク</div>
            <div className="col-span-2">ステータス</div>
            <div className="col-span-2">開始日</div>
            <div className="col-span-2">終了日</div>
            <div className="col-span-2">進捗</div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-border">
            {filteredCompanies.map((company) => {
              const isExpanded = expandedItems.has(company.id)
              const StatusIcon = statusConfig[company.status].icon

              return (
                <div key={company.id}>
                  {/* Parent Row */}
                  <div className="grid grid-cols-12 gap-4 p-4 hover:bg-muted/30 transition-colors">
                    <div className="col-span-4 flex items-center gap-2">
                      <button
                        onClick={() => toggleExpand(company.id)}
                        className="p-1 hover:bg-muted rounded transition-colors"
                      >
                        {isExpanded ? (
                          <ChevronDown className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        )}
                      </button>
                      <Target className="h-4 w-4 text-primary flex-shrink-0" />
                      <span className="font-semibold text-foreground">{company.title}</span>
                    </div>
                    <div className="col-span-2 flex items-center">
                      <Badge className={statusConfig[company.status].color}>
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {statusConfig[company.status].label}
                      </Badge>
                    </div>
                    <div className="col-span-2 flex items-center text-sm text-muted-foreground">
                      {company.startDate}
                    </div>
                    <div className="col-span-2 flex items-center text-sm text-muted-foreground">
                      {company.endDate}
                    </div>
                    <div className="col-span-2 flex items-center gap-3">
                      <div className="flex-1">
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary transition-all duration-300"
                            style={{ width: `${company.progress}%` }}
                          />
                        </div>
                      </div>
                      <span className="text-sm font-medium text-foreground w-10 text-right">
                        {company.progress}%
                      </span>
                    </div>
                  </div>

                  {/* Subtasks */}
                  {isExpanded && company.subtasks && (
                    <div className="bg-muted/20">
                      {company.subtasks.map((subtask) => {
                        const SubtaskIcon = statusConfig[subtask.status].icon
                        
                        return (
                          <div
                            key={subtask.id}
                            className="grid grid-cols-12 gap-4 p-4 hover:bg-muted/30 transition-colors border-l-2 border-border ml-4"
                          >
                            <div className="col-span-4 flex items-center gap-2 pl-8">
                              <SubtaskIcon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                              <span className="text-sm text-foreground">{subtask.title}</span>
                            </div>
                            <div className="col-span-2 flex items-center">
                              <Badge variant="outline" className={`text-xs ${statusConfig[subtask.status].color}`}>
                                {statusConfig[subtask.status].label}
                              </Badge>
                            </div>
                            <div className="col-span-2 flex items-center text-xs text-muted-foreground">
                              {subtask.startDate}
                            </div>
                            <div className="col-span-2 flex items-center text-xs text-muted-foreground">
                              {subtask.endDate}
                            </div>
                            <div className="col-span-2 flex items-center gap-3">
                              <div className="flex-1">
                                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                                  <div 
                                    className={`h-full transition-all duration-300 ${
                                      subtask.status === 'completed' ? 'bg-green-500' : 'bg-primary'
                                    }`}
                                    style={{ width: `${subtask.progress}%` }}
                                  />
                                </div>
                              </div>
                              <span className="text-xs font-medium text-muted-foreground w-10 text-right">
                                {subtask.progress}%
                              </span>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </Card>

        {/* Timeline View Hint */}
        <div className="mt-6 p-4 border border-dashed border-border rounded-lg">
          <p className="text-sm text-muted-foreground text-center">
            💡 ガントチャート形式での表示は今後のアップデートで追加予定です
          </p>
        </div>
      </div>
    </div>
  )
}
