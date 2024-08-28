import { SVGProps } from 'react';

interface Props extends SVGProps<SVGSVGElement> {}

function BankIcon(props: Props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="25"
      height="25"
      fill="none"
      aria-hidden="true"
      stroke="currentColor"
      {...props}
    >
      <path
        // fill="#fff"
        d="M5.814 18.964v-8.475h1.5v8.475h-1.5Zm6.05 0v-8.475h1.5v8.475h-1.5Zm-9.35 3v-1.5h20v1.5h-20Zm15.2-3v-8.475h1.5v8.475h-1.5Zm-15.2-9.975V7.664l10-5.7 10 5.7v1.325h-20Zm3.35-1.5h13.3-13.3Zm0 0h13.3l-6.65-3.8-6.65 3.8Z"
      />
    </svg>
  );
}

export default BankIcon;
