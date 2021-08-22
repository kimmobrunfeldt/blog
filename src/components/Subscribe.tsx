import React from "react";
import MailchimpSubscribe, {
  DefaultFormFields,
  FormHooks,
} from "react-mailchimp-subscribe";
import { H } from "src/components/H";
import { P } from "src/components/P";
import { Button } from "src/components/Button";

const url =
  "https://blog.us1.list-manage.com/subscribe/post?u=af54e3644e951c32ad39be6de&id=10b8bb6236";

const Form = ({ subscribe, status, message }: FormHooks<DefaultFormFields>) => {
  const [email, setEmail] = React.useState("");

  return (
    <>
      <H className="mb-1" visualLevel={2}>
        Hit that bell
      </H>
      <P>Get an email when a post is published.</P>
      <div className="relative">
        <input
          className="relative appearance-none border border-gray-5 focus:border-rust-5 rounded w-full py-2 px-3 text-gray-700 focus:outline-none"
          id="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email address"
        />
        <Button
          style={{ transform: "translateY(-50%)", top: "50%" }}
          className="absolute right-1"
          onClick={() => subscribe({ EMAIL: email })}
        >
          Subscribe
        </Button>
      </div>
    </>
  );
};

export const Subscribe = () => {
  const [email, setEmail] = React.useState("");

  return (
    <MailchimpSubscribe
      url={url}
      render={({
        subscribe,
        status,
        message,
      }: FormHooks<DefaultFormFields>) => {
        return (
          <>
            <H className="mb-1" visualLevel={2}>
              Hit that bell
            </H>
            <P>Get an email when a post is published.</P>
            <div className="relative">
              <input
                className="relative appearance-none border border-gray-5 focus:border-rust-5 rounded w-full py-2 px-3 text-gray-700 focus:outline-none"
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
              />
              <Button
                style={{ transform: "translateY(-50%)", top: "50%" }}
                className="absolute right-1"
                onClick={() => subscribe({ EMAIL: email })}
              >
                Subscribe
              </Button>
            </div>
          </>
        );
      }}
    />
  );
};
