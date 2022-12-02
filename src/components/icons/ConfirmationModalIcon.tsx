import { SVGProps } from 'react';

interface Props extends SVGProps<SVGSVGElement> {}

function ConfirmationModalIcon(props: Props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="153"
      height="151"
      fill="none"
      aria-hidden="true"
      stroke="currentColor"
      {...props}
    >
      <ellipse cx="76.5" cy="75.5" fill="#FD8B4B" rx="76" ry="75.5" />
      <path
        fill="url(#a)"
        d="M101 56.75v38.5c0 2.077-1.782 3.75-3.995 3.75h-41.01C53.782 99 52 97.327 52 95.25v-38.5c0-2.077 1.782-3.75 3.995-3.75h41.01c2.213 0 3.995 1.673 3.995 3.75Z"
      />
      <path
        fill="#fff"
        fillRule="evenodd"
        d="m78.838 57.601 4.464 4.19-16.086 15.101c-2.465-2.314-2.465-6.066 0-8.38l11.623-10.91Zm-.003 10.61 4.463 4.19-10.5 9.858-4.464-4.19 10.5-9.857Zm5.764 13.58c2.465-2.315 2.465-6.066 0-8.38L68.335 88.678l4.464 4.19 11.8-11.078Z"
        clipRule="evenodd"
      />
      <defs>
        <linearGradient
          id="a"
          x1="101"
          x2="55.092"
          y1="53"
          y2="101.902"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#319BFF" />
          <stop offset=".536" stopColor="#0084FF" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export default ConfirmationModalIcon;
