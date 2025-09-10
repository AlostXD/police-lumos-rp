import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

/* sticky top-0 z-50 (Colocar depois na Div para deixar ela presa na tela)*/

export default function Navbar() {
    return (
        <>
        <div className='flex flex-col justify-center md:justify-between items-center py-3 gap-12 md:flex-row md:m-auto md:w-4/5 md:py-6 md:gap-0 border-b-2 p-40'>
            <Image src="./logo.svg" alt="Logo" width={100} height={100} className='invert' />
            <ul className='flex flex-col md:flex-row justify-center items-center gap-8'>
                <li className='hover:scale-125 hover:transition-all hover:text-zinc-600 duration-500 ease-in-out'><Link href="/">Home</Link></li>
                <li className='hover:scale-125 hover:transition-all hover:text-zinc-600 duration-500 ease-in-out'><Link href="/relatorios">Relatórios</Link></li>
                <li className='hover:scale-125 hover:transition-all hover:text-zinc-600 duration-500 ease-in-out'><Link href="/suporte">Suporte</Link></li>
                {/*<li className='hover:scale-125 hover:transition-all hover:text-zinc-600 duration-500 ease-in-out'><Link href="/edital">Edital</Link></li>*/}
            </ul>
        </div>
        </>
    )
}