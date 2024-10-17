import React from 'react'
import type { Metadata } from 'next'
//import { Inter } from 'next/font/google'
import './globals.css'
//import { Header } from '@/components/Header'
//import { BackgroundImage } from '@/components/BackgroundImage'
import { Footer } from '@/components/Footer'

import '../../styles/style.css'
import '../../styles/banner.css'
import '../../styles/buttons.css'
import '../../styles/content.css'
import '../../styles/footer.css'
import '../../styles/layout.css'
import '../../styles/nav.css'
import '../../styles/side-content.css'
import '../../styles/wrapper.css'
import '../../styles/search.css'
import '../../styles/card.css'
import '../../styles/loading.css'
import '../../styles/fonts.css'

//const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Research Portal',
  description: 'Discover new projects',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en' className='h-full bg-white antialiased'>
      <body className="body">
        {/* <Header /> */}
        {/*<BackgroundImage position='right' className='-bottom-32 -top-40' />*/}
        {children}
        <Footer />
      </body>
    </html>
  )
}
