'use client'
import Image from 'next/image'
import React from 'react'
import Logo from '../public/images/MajlisLogo.png'
import { Button } from './ui/button'
import { usePathname, useRouter } from 'next/navigation'
// import { useRouter } from 'next/router'

const Header = () => {
    const router = useRouter();
    const pathname = usePathname()   // <-- current path
    console.log(pathname)

    return (
        <div className='py-5 px-5 md:px-12 lg:px-28'>
            <div className='flex justify-between items-center'>
                <div className='flex justify-center items-center gap-5 hover:cursor-pointer' onClick={() => router.push('/blog/all')}>
                    <Image src={Logo} width={40} height={40} alt='' className='w-[130px] sm:w-auto' />
                    <h1 className='text-sm sm:text-xl font-medium'>Muslim Majlis - UOC</h1>
                </div>
                <div className='lex items-center gap-2 sm:gap-4'>
                    <Button variant={'ghost'} className={`px-2 sm:px-4 ${pathname === '/home' ? 'underline' : ''}`}>Home</Button>
                    <Button variant={'ghost'} className={`px-2 sm:px-4 ${pathname === '/blog' ? 'text-lg underline' : ''}`}>Blogs</Button>
                    <Button variant={'ghost'} className={`px-2 sm:px-4 ${pathname === '/aboutUs' ? 'underline' : ''}`}>About Us</Button>
                    <Button variant={'ghost'} className={`px-2 sm:px-4 ${pathname === '/contactUs' ? 'underline' : ''}`}>Conact Us</Button>
                    <Button className='bg-black hover:bg-gray-700'>Login</Button>
                </div>
                {/* <button className='flex items-center gap-2 font-medium py-1 px-3 sm:py-3 sm:px-6 border border-solid border-black shadow-[-7px_7px_0px_#000000]'>Login</button> */}
            </div>
        </div>
    )
}

export default Header
