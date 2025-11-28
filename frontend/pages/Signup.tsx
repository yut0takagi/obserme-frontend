import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Input, Card } from '../components/ui';

const Signup = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    // モック登録
    console.log('Signup with', name, email, password);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 transition-colors duration-200">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-12 h-12 bg-indigo-600 rounded-lg flex items-center justify-center">
             <span className="text-white font-bold text-2xl">O</span>
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
          新規アカウント作成
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          すでにアカウントをお持ちですか？{' '}
          <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400">
            ログイン
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card className="py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSignup}>
            <Input 
              label="お名前" 
              type="text" 
              required 
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            
            <Input 
              label="メールアドレス" 
              type="email" 
              autoComplete="email" 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Input 
              label="パスワード" 
              type="password" 
              autoComplete="new-password" 
              required 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <div>
              <Button type="submit" className="w-full">
                アカウント作成
              </Button>
            </div>
          </form>

          <div className="mt-6 text-center text-xs text-gray-500 dark:text-gray-400">
            登録することで、<a href="#" className="underline">利用規約</a>と<a href="#" className="underline">プライバシーポリシー</a>に同意したことになります。
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Signup;