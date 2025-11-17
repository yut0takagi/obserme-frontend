'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Home,
  Clock,
  MessageSquare,
  FileText,
  Briefcase,
  LinkIcon,
  Sparkles,
  Shield,
  Zap,
  ArrowRight,
} from 'lucide-react'

const features = [
  {
    icon: MessageSquare,
    title: 'AI Assistant',
    description: '高度なAIがあなたの質問に答え、タスクをサポートします',
  },
  {
    icon: Clock,
    title: 'Timeline',
    description: '日々の活動を時系列で記録し、振り返りを簡単に',
  },
  {
    icon: FileText,
    title: 'Documents',
    description: '重要な資料を一元管理し、いつでもアクセス可能',
  },
  {
    icon: Briefcase,
    title: 'Job / Career',
    description: '就活情報やキャリアプランを効率的に管理',
  },
  {
    icon: LinkIcon,
    title: 'Integrations',
    description: '様々なサービスと連携して生産性を向上',
  },
  {
    icon: Home,
    title: 'Dashboard',
    description: 'すべての情報を一目で確認できる統合ダッシュボード',
  },
]

const benefits = [
  {
    icon: Sparkles,
    title: 'スマートな管理',
    description: 'AIが自動的に情報を整理し、必要な時に必要な情報を提供します',
  },
  {
    icon: Shield,
    title: 'セキュアな環境',
    description: 'あなたのデータは暗号化され、安全に保護されます',
  },
  {
    icon: Zap,
    title: '高速アクセス',
    description: 'どこからでも素早くアクセスし、作業を継続できます',
  },
]

export function LandingView() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                ObserMe
              </h1>
            </div>
            <nav className="flex items-center gap-4">
              <Link href="/login">
                <Button variant="ghost">ログイン</Button>
              </Link>
              <Link href="/signup">
                <Button>無料で始める</Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        <div className="text-center space-y-8 max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight">
            あなたのデータを
            <span className="block mt-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              一つの場所で管理
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            ObserMeは、AI、日記、資料、就活情報を統合管理できる
            <br />
            次世代のパーソナルデータハブです
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/signup">
              <Button size="lg" className="w-full sm:w-auto">
                無料で始める
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                ログイン
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 bg-muted/30">
        <div className="text-center space-y-4 mb-16">
          <h3 className="text-3xl md:text-4xl font-bold">主な機能</h3>
          <p className="text-muted-foreground text-lg">
            あなたの生活をサポートする充実した機能
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <Card key={feature.title}>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription>{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center space-y-4 mb-16">
          <h3 className="text-3xl md:text-4xl font-bold">なぜObserMeなのか</h3>
          <p className="text-muted-foreground text-lg">
            他のツールとは一線を画す特徴
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {benefits.map((benefit) => (
            <div key={benefit.title} className="text-center space-y-4">
              <div className="inline-flex p-4 rounded-full bg-primary/10">
                <benefit.icon className="h-8 w-8 text-primary" />
              </div>
              <h4 className="text-xl font-semibold">{benefit.title}</h4>
              <p className="text-muted-foreground">{benefit.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
          <CardContent className="py-12 text-center space-y-6">
            <h3 className="text-3xl md:text-4xl font-bold">
              今すぐ始めましょう
            </h3>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              無料でアカウントを作成して、あなたのデータ管理を
              <br />
              次のレベルへ引き上げましょう
            </p>
            <Link href="/signup">
              <Button size="lg">
                無料でアカウントを作成
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                ObserMe
              </h1>
              <p className="text-sm text-muted-foreground">
                あなたのデータハブ
              </p>
            </div>
            <div>
              <h5 className="font-semibold mb-4">プロダクト</h5>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    機能
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    料金
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    セキュリティ
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-4">サポート</h5>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    ヘルプセンター
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    お問い合わせ
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    ドキュメント
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-4">会社</h5>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    会社概要
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    プライバシーポリシー
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    利用規約
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-border text-center text-sm text-muted-foreground">
            <p>&copy; 2025 ObserMe. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
