import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { GeneratorProvider } from '@/contexts/WorkflowContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'リーンキャンバス作成アプリ',
  description: 'AI支援によるリーンキャンバス作成ツール',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body className={inter.className}>
        <GeneratorProvider>
          <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            <header className="bg-white/80 backdrop-blur-sm border-b">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <h1 className="text-2xl font-bold text-gray-900">
                  リーンキャンバス作成アプリ
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                  AI支援でビジネスアイデアをリーンキャンバスに展開
                </p>
              </div>
            </header>
            <main className="py-8 px-4 sm:px-6 lg:px-8">
              {children}
            </main>
          </div>
        </GeneratorProvider>
      </body>
    </html>
  )
}