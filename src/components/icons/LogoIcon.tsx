import { SVGProps } from 'react';

interface Props extends SVGProps<SVGSVGElement> {}

function LogoIcon(props: Props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="47"
      height="40"
      stroke="currentColor"
      viewBox="0 0 47 40"
      aria-hidden="true"
      aria-label="Peer logo"
      fill="none"
      {...props}
    >
      <path
        d="M46.5508 34.396C46.5508 37.1574 44.3122 39.396 41.5508 39.396H25.3446V35.3589C25.3446 33.7021 26.6878 32.3589 28.3446 32.3589H46.5508V34.396Z"
        fill="#61F3E1"
      />
      <path
        d="M0 11.0703H41.5501C44.3115 11.0703 46.5501 13.3089 46.5501 16.0703V18.1074H0V11.0703Z"
        fill="#61F3E1"
      />
      <path
        d="M0 5.60401C0 2.84258 2.23858 0.604004 5 0.604004H21.2062V4.64105C21.2062 6.29791 19.863 7.64106 18.2062 7.64106H0V5.60401Z"
        fill="#61F3E1"
      />
      <path
        d="M0 21.5366H46.5501V28.5737H5.00001C2.23858 28.5737 0 26.3351 0 23.5737V21.5366Z"
        fill="#61F3E1"
      />
    </svg>
  );
}

export default LogoIcon;
