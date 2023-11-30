import Link from 'next/link';
import { MaxWidthWrapper } from './MaxWidthWrapper';
import Image from 'next/image';
import { buttonVariants } from './ui/button';
import { LoginLink, RegisterLink } from '@kinde-oss/kinde-auth-nextjs/server';
import { ArrowRight } from 'lucide-react';

export const NavBar = () => {
  return (
    <nav className='sticky h-14 inset-x-0 top-0 z-30 w-full border-b border-gray-200 bg-white/75 backdrop-blur-lg transition-all'>
      <MaxWidthWrapper>
        <div className='flex h-14 items-center justify-between border-b border-slate-200'>
          <Link href='/'>
            <Image
              src='/logo.png'
              height={500}
              width={500}
              className='h-14 w-14 bg-none'
              alt='Docmate Logo'
            />
          </Link>

          {/* TODO: Add mobile navbar */}

          <div className='hidden items-center space-x-4 sm:flex'>
            <>
              <Link
                href='/pricing'
                className={buttonVariants({ variant: 'ghost', size: 'sm' })}
              >
                Pricing
              </Link>
              <LoginLink
                className={buttonVariants({ variant: 'ghost', size: 'sm' })}
              >
                Login
              </LoginLink>
              <RegisterLink className={buttonVariants({ size: 'sm' })}>
                Get started <ArrowRight />
              </RegisterLink>
            </>
          </div>
        </div>
      </MaxWidthWrapper>
    </nav>
  );
};
