import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui';
import { CheckSquare, Briefcase, Mic, ArrowRight } from 'lucide-react';

const Landing = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200">
      {/* Header */}
      <header className="border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">O</span>
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white">Obserme</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/login" className="text-sm font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
              ログイン
            </Link>
            <Link to="/signup">
              <Button size="sm">無料で始める</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-20 pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-6">
            就活も、学習も、<br />
            <span className="text-indigo-600 dark:text-indigo-400">すべてを一箇所で。</span>
          </h1>
          <p className="text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto mb-10">
            Obsermeは、学生や若手プロフェッショナルのためのオールインワン・ダッシュボードです。
            タスク管理、選考状況、そしてAIアシスタントがあなたの成長をサポートします。
          </p>
          <div className="flex justify-center space-x-4">
            <Link to="/signup">
              <Button size="lg" className="px-8 shadow-xl shadow-indigo-200 dark:shadow-none">
                今すぐ始める
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link to="/login">  // TODO: デモページを作成してリンクを変更
              <Button variant="secondary" size="lg" className="px-8">
                デモを見る
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="bg-gray-50 dark:bg-gray-800/50 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center mx-auto mb-6 text-blue-600 dark:text-blue-400">
                <CheckSquare className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">スマートタスク管理</h3>
              <p className="text-gray-500 dark:text-gray-400">
                就活、勉強、プライベートのタスクをカテゴリ別に整理。WBS形式でプロジェクトごとの進捗も可視化できます。
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-2xl flex items-center justify-center mx-auto mb-6 text-purple-600 dark:text-purple-400">
                <Briefcase className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">選考状況トラッカー</h3>
              <p className="text-gray-500 dark:text-gray-400">
                エントリーから内定まで、各社の選考フェーズを一元管理。詳細メモ機能で面接の振り返りも万全です。
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center mx-auto mb-6 text-indigo-600 dark:text-indigo-400">
                <Mic className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">AI ライブアシスタント</h3>
              <p className="text-gray-500 dark:text-gray-400">
                AIとリアルタイムで音声会話。面接練習やキャリア相談がいつでも可能です。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 py-12">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-400 dark:text-gray-500 text-sm">
          &copy; 2026 Obserme. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Landing;