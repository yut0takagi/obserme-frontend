import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { MessageSquare, Mail, Calendar, MessageCircle, LinkIcon, Check } from 'lucide-react'

const integrations = [
  {
    name: 'ChatGPT',
    icon: MessageSquare,
    description: 'AI対話履歴を自動的にObserMeに記録',
    status: 'connected',
    color: 'text-chart-1'
  },
  {
    name: 'Gmail',
    icon: Mail,
    description: '重要なメールをタグ付けして保存',
    status: 'connected',
    color: 'text-destructive'
  },
  {
    name: 'Google Calendar',
    icon: Calendar,
    description: '予定と関連する活動を紐付け',
    status: 'connected',
    color: 'text-primary'
  },
  {
    name: 'Slack',
    icon: MessageCircle,
    description: 'チームでのやり取りを記録',
    status: 'disconnected',
    color: 'text-accent'
  },
  {
    name: 'LINE',
    icon: MessageCircle,
    description: '日常の会話から気づきを抽出',
    status: 'disconnected',
    color: 'text-chart-2'
  },
  {
    name: 'Notion',
    icon: LinkIcon,
    description: 'ノートとObserMeを同期',
    status: 'disconnected',
    color: 'text-foreground'
  },
]

export function IntegrationsView() {
  return (
    <div className="h-full overflow-auto">
      <div className="container mx-auto p-8 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Integrations</h1>
          <p className="text-muted-foreground max-w-2xl">
            ObserMe はあなたの許可した範囲のデータだけを取得し、就活・キャリアに役立つ形で整理します。
            プライバシーとセキュリティを最優先に設計されています。
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">接続済み</p>
                <p className="text-3xl font-bold text-foreground">3</p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Check className="h-6 w-6 text-primary" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">利用可能</p>
                <p className="text-3xl font-bold text-foreground">6</p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center">
                <LinkIcon className="h-6 w-6 text-accent" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">今週の同期</p>
                <p className="text-3xl font-bold text-foreground">47</p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-chart-3/10 flex items-center justify-center">
                <MessageSquare className="h-6 w-6 text-chart-3" />
              </div>
            </div>
          </Card>
        </div>

        {/* Integrations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {integrations.map((integration) => {
            const Icon = integration.icon
            const isConnected = integration.status === 'connected'

            return (
              <Card key={integration.name} className="p-6 hover:border-primary/50 transition-colors">
                <div className="flex items-start gap-4">
                  <div className={`h-14 w-14 rounded-xl bg-muted flex items-center justify-center flex-shrink-0 ${integration.color}`}>
                    <Icon className="h-7 w-7" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold text-foreground">{integration.name}</h3>
                      {isConnected && (
                        <Badge variant="secondary" className="bg-primary/10 text-primary">
                          接続中
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">
                      {integration.description}
                    </p>

                    {isConnected ? (
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          設定
                        </Button>
                        <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                          接続解除
                        </Button>
                      </div>
                    ) : (
                      <Button size="sm">
                        接続する
                      </Button>
                    )}
                  </div>
                </div>

                {isConnected && (
                  <div className="mt-4 pt-4 border-t border-border">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">最終同期</span>
                      <span className="font-medium">2分前</span>
                    </div>
                  </div>
                )}
              </Card>
            )
          })}
        </div>

        {/* Info Card */}
        <Card className="mt-8 p-6 bg-primary/5 border-primary/20">
          <h3 className="font-semibold text-foreground mb-2">データのプライバシーについて</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            ObserMe は、あなたのデータを第三者に共有することは一切ありません。
            すべてのデータは暗号化され、あなただけがアクセスできます。
            また、いつでもデータのエクスポートや削除が可能です。
          </p>
        </Card>
      </div>
    </div>
  )
}
