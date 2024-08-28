import { Transition } from '@headlessui/react';
import { ExclamationCircleIcon } from '@heroicons/react/20/solid';

interface Props {
  error: string;
  show: boolean;
}

function InlineErrorDisplay({ error, show }: Props) {
  return (
    <Transition
      show={show}
      enter="transition-all duration-75"
      enterFrom="opacity-0 scale-90"
      enterTo="opacity-100 scale-100"
      leave="transition-all duration-150"
      leaveFrom="opacity-100 scale-100"
      leaveTo="opacity-0 scale-75"
      className="my-2 flex items-center space-x-2 rounded-3xl bg-[#FAEBEB] p-3"
    >
      <ExclamationCircleIcon className="h-5 w-5 text-mad" />
      <p role="alert" className="text-sm text-mad">
        {error}
      </p>
    </Transition>
  );
}

export default InlineErrorDisplay;
