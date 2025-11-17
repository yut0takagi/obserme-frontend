'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Send, Plus, FileText, MessageSquare, Sparkles } from 'lucide-react'

const sessions = [
  { id: 1, title: 'キャリアプランニング', date: '2025/11/17', messages: 23 },
  { id: 2, title: 'ES ブラッシュアップ', date: '2025/11/16', messages: 15 },
  { id: 3, title: '面接対策', date: '2025/11/15', messages: 31 },
  { id: 4, title: '技術学習の相談', date: '2025/11/14', messages: 12 },
]

const messages = [
  {
    role: 'user',
    content: 'これまでの日記とES内容を見て、私の強みを3つ教えてください',
    time: '10:30'
  },
  {
    role: 'assistant',
    content: `あなたの記録を分析した結果、以下の3つの強みが見えてきました：

1. **継続的な学習姿勢**
   日記から、新しい技術への挑戦を続けており、特にReactやTypeScriptなどのモダンな技術スタックに積極的に取り組んでいることがわかります。

2. **チーム開発での協調性**
   グループディスカッションやチームプロジェクトでの記録から、他者の意見を尊重しながら自分の考えを伝える能力が高いことが読み取れます。

3. **課題解決への論理的アプローチ**
   講義ノートやプロジェクトの振り返りから、問題を構造化して解決する思考プロセスが明確です。

これらの強みは、特にプロダクト開発やエンジニアリング職で高く評価されるでしょう。`,
    time: '10:31',
    references: 3
  },
  {
    role: 'user',
    content: 'この強みを活かして、サイバーエージェントのESをブラッシュアップしてもらえますか？',
    time: '10:35'
  },
  {
    role: 'assistant',
    content: `もちろんです。現在のES内容を確認しました。あなたの強みをより効果的に伝えるために、以下のような構成を提案します：

**「学生時代に最も力を入れたこと」の改善案：**

冒頭で技術への情熱を示し、具体的なプロジェクト例として「チーム開発でのReact実装」を挙げ、そこでの課題解決プロセスを論理的に説明します。最後に、この経験をどう貴社で活かせるかを結びつけます。

詳細を一緒に作り込んでいきましょうか？`,
    time: '10:36',
    references: 5
  },
]

export function AssistantView() {
  const [message, setMessage] = useState('')
  const [activeSession, setActiveSession] = useState(1)

  return (
    <div className="h-full overflow-hidden flex">
      {/* Sessions List */}
      <aside className="w-80 border-r border-border bg-card/50">
        <div className="p-4 border-b border-border">
          <Button className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            新しいセッション
          </Button>
        </div>

        <div className="p-3 overflow-auto h-[calc(100vh-8rem)]">
          <div className="space-y-2">
            {sessions.map((session) => (
              <button
                key={session.id}
                onClick={() => setActiveSession(session.id)}
                className={`w-full text-left p-3 rounded-lg transition-colors ${
                  activeSession === session.id
                    ? 'bg-primary/10 border border-primary/50'
                    : 'hover:bg-muted'
                }`}
              >
                <h3 className="font-medium text-sm mb-1">{session.title}</h3>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{session.date}</span>
                  <span>{session.messages} メッセージ</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </aside>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="p-4 border-b border-border bg-card/50">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">キャリアプランニング</h2>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="secondary" className="text-xs">
                  <FileText className="h-3 w-3 mr-1" />
                  日記 10件
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  <FileText className="h-3 w-3 mr-1" />
                  ES 2件
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  <FileText className="h-3 w-3 mr-1" />
                  講義メモ 3件
                </Badge>
              </div>
            </div>
            <Button variant="outline" size="sm">
              セッション設定
            </Button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-auto p-6 space-y-6">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'assistant' && (
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="h-5 w-5 text-primary" />
                </div>
              )}

              <div
                className={`max-w-[70%] ${
                  msg.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-card border border-border'
                } rounded-lg p-4`}
              >
                <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                
                {msg.references && (
                  <div className="mt-3 pt-3 border-t border-border/50">
                    <Button variant="ghost" size="sm" className="h-auto py-1 px-2 text-xs">
                      <FileText className="h-3 w-3 mr-1" />
                      参照元 {msg.references}件を表示
                    </Button>
                  </div>
                )}

                <div className={`text-xs mt-2 ${msg.role === 'user' ? 'text-primary-foreground/60' : 'text-muted-foreground'}`}>
                  {msg.time}
                </div>
              </div>

              {msg.role === 'user' && (
                <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-semibold text-accent">YS</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-border bg-card/50">
          <div className="flex gap-3">
            <Input
              placeholder="メッセージを入力..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  // Send message logic
                }
              }}
              className="flex-1"
            />
            <Button size="icon">
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Enter で送信、Shift + Enter で改行
          </p>
        </div>
      </div>

      {/* Context Panel */}
      <aside className="w-80 border-l border-border bg-card/50 overflow-auto p-4">
        <h3 className="font-semibold mb-4">参照中のデータ</h3>
        
        <div className="space-y-3">
          {[
            { title: '今日の振り返り', type: '日記', date: '2025/11/17' },
            { title: 'サイバーエージェント ES', type: 'ES', date: '2025/11/16' },
            { title: 'プロダクト開発の学び', type: '日記', date: '2025/11/15' },
            { title: '機械学習の基礎', type: '講義', date: '2025/11/14' },
          ].map((item, index) => (
            <Card key={index} className="p-3 hover:bg-muted/50 transition-colors cursor-pointer">
              <h4 className="font-medium text-sm mb-1">{item.title}</h4>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{item.type}</span>
                <span>{item.date}</span>
              </div>
            </Card>
          ))}
        </div>
      </aside>
    </div>
  )
}
