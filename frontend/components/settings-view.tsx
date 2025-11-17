'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { User, Bell, Shield, Download, Palette } from 'lucide-react'

export function SettingsView() {
  return (
    <div className="h-full overflow-auto">
      <div className="container mx-auto p-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Settings</h1>
          <p className="text-muted-foreground">
            アカウントとアプリケーションの設定を管理
          </p>
        </div>

        <div className="space-y-6">
          {/* Profile Section */}
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <User className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">プロフィール</h2>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="lastName">姓</Label>
                  <Input id="lastName" defaultValue="山田" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="firstName">名</Label>
                  <Input id="firstName" defaultValue="太郎" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">メールアドレス</Label>
                <Input id="email" type="email" defaultValue="yamada@example.com" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="university">大学</Label>
                  <Input id="university" defaultValue="東京大学" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department">学部</Label>
                  <Input id="department" defaultValue="工学部" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="graduationYear">卒業年度</Label>
                <Input id="graduationYear" defaultValue="2026" />
              </div>

              <Button>変更を保存</Button>
            </div>
          </Card>

          {/* Notifications Section */}
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <Bell className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">通知設定</h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>メール通知</Label>
                  <p className="text-sm text-muted-foreground">
                    重要な更新をメールで受け取る
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Slack通知</Label>
                  <p className="text-sm text-muted-foreground">
                    タスクリマインダーをSlackに送信
                  </p>
                </div>
                <Switch />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>日次サマリー</Label>
                  <p className="text-sm text-muted-foreground">
                    毎日の活動サマリーを受け取る
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>就活リマインダー</Label>
                  <p className="text-sm text-muted-foreground">
                    選考の期限前に通知
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
            </div>
          </Card>

          {/* Theme Section */}
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <Palette className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">テーマ</h2>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <button className="p-4 rounded-lg border-2 border-primary bg-background text-left">
                  <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-background to-muted mb-3"></div>
                  <p className="font-medium">ダーク</p>
                  <p className="text-xs text-muted-foreground mt-1">現在のテーマ</p>
                </button>
                <button className="p-4 rounded-lg border border-border hover:border-primary/50 transition-colors text-left">
                  <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-white to-gray-100 mb-3"></div>
                  <p className="font-medium">ライト</p>
                  <p className="text-xs text-muted-foreground mt-1">切り替え可能</p>
                </button>
              </div>
            </div>
          </Card>

          {/* Data & Privacy Section */}
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <Shield className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">データとプライバシー</h2>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">データエクスポート</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  すべてのデータをJSON形式でダウンロード
                </p>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  データをエクスポート
                </Button>
              </div>

              <div className="pt-4 border-t border-border">
                <h3 className="font-medium mb-2 text-destructive">アカウント削除</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  アカウントとすべてのデータを完全に削除します。この操作は取り消せません。
                </p>
                <Button variant="destructive">
                  アカウントを削除
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
