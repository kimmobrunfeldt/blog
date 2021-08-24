import React from "react";
import { Subscribe } from "src/components/Subscribe";
import { EnvelopeLetter } from "src/components/EnvelopeLetter";
import { H } from "src/components/H";

export const SubscribeEnvelope = () => {
  const [activeLetter, setActiveLetter] = React.useState(1);

  const container = "px-3 py-3 sm:px-6 sm:py-6";
  return (
    <EnvelopeLetter className="load-fadein" activeLetter={activeLetter}>
      <div className={container}>
        <H className="text-2xl mt-0 mb-1 sm:mb-2 sm:text-3xl">Thank you!</H>
        <p className="max-w-xl font-sans mb-2 sm:mb-4 md:mb-paragraph">
          You should get a confirmation email soon. I'll keep the content coming
          up!
        </p>

        <div className="lg:text-lg italic">- Kimmo</div>
      </div>
      <div className={container}>
        <Subscribe onSubscribe={() => setActiveLetter(0)} />
      </div>
    </EnvelopeLetter>
  );
};
