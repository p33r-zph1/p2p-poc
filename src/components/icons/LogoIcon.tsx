import { SVGProps } from 'react';

interface Props extends SVGProps<SVGSVGElement> {}

function LogoIcon(props: Props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      stroke="currentColor"
      aria-hidden="true"
      aria-label="Peer logo"
      width="32"
      height="32"
      fill="none"
      {...props}
    >
      <path
        fill="url(#a)"
        d="M32 2.61v26.78A2.603 2.603 0 0 1 29.39 32H2.61A2.603 2.603 0 0 1 0 29.39V2.61A2.603 2.603 0 0 1 2.61 0h26.78A2.603 2.603 0 0 1 32 2.61Z"
      />
      <path
        fill="#fff"
        fillRule="evenodd"
        d="m17.526 3.2 2.915 2.916L9.936 16.62a4.122 4.122 0 0 1 0-5.83l7.59-7.59Zm-.003 7.382 2.915 2.915-6.857 6.857-2.915-2.914 6.857-6.858Zm3.765 9.446a4.122 4.122 0 0 0 0-5.83L10.667 24.82l2.915 2.915 7.706-7.707Z"
        clipRule="evenodd"
      />
      <defs>
        <linearGradient
          id="a"
          x1="32"
          x2="0"
          y1="0"
          y2="32"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#319BFF" />
          <stop offset=".536" stopColor="#0084FF" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export default LogoIcon;
