import React, { FormEvent } from "react";
import { H } from "src/components/H";
import cn from "classnames";
import { Button } from "src/components/Button";
import fetchJsonp from "fetch-jsonp";
import * as toast from "src/components/Toast";

type FormFieldName = "EMAIL";

const SUBSCRIBE_URL =
  "https://blog.us1.list-manage.com/subscribe/post-json?u=af54e3644e951c32ad39be6de&id=10b8bb6236";

function formatMessage(message: string): string {
  if (!message) {
    return "Unknown error";
  }

  if (message.startsWith("0 - ")) {
    return message.split("0 - ")[1].trim();
  }

  const splitter = "already subscribed to list kimmo.blog.";
  if (message.includes(splitter)) {
    return "Already subscribed";
  }

  return message.trim();
}

export type SubscribeProps = {
  onSubscribe: (fields: Record<FormFieldName, string>) => void;
};

export const Subscribe = ({ onSubscribe }: SubscribeProps) => {
  const [email, setEmail] = React.useState("");
  const [response, setResponse] = React.useState<any>(undefined);
  const [loading, setLoading] = React.useState(false);

  // To prevent text going under button
  const inputCls = loading
    ? "pr-[130px] sm:pr-[164px]"
    : "pr-[98px] sm:pr-[130px]";
  return (
    <form onSubmit={(e) => onSubmit(e, { EMAIL: email })}>
      <H className="text-2xl mt-0 mb-1 sm:text-3xl">Like the content?</H>
      <p className="max-w-xl font-sans mb-2 sm:mb-paragraph">
        Let me know by subscribing to new posts.
      </p>
      <div className="relative">
        <input
          className={cn(
            inputCls,
            "py-1 px-2 sm:py-2 sm:px-3 appearance-none border border-gray-4",
            "focus:border-rust-5 rounded w-full text-gray-5 dark:text-gray-3 focus:outline-none",
            "dark:bg-gray-8"
          )}
          id="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email address"
        />
        <Button
          type="submit"
          style={{
            // Override link hover effect's relative positioning
            position: "absolute",
            transform: "translateY(-50%)",
            top: "50%",
          }}
          className="absolute right-0.5 sm:right-1"
          disabled={loading}
        >
          {loading ? "Subscribing.." : "Subscribe"}
        </Button>
      </div>

      {!loading && response?.result !== "success" && response?.msg && (
        <span className="text-danger-4 text-xs pl-4">
          {formatMessage(response.msg)}
        </span>
      )}

      <BotDetectField />
    </form>
  );

  async function onSubmit(
    e: FormEvent<HTMLFormElement>,
    fields: Record<FormFieldName, string>
  ) {
    e.preventDefault();

    setLoading(true);

    let res;
    try {
      res = await subscribe(fields);
      onSubscribe(fields);
    } catch (err) {
      toast.error("Couldn't subscribe");
      throw err;
      // ignore since message was logged
    } finally {
      setLoading(false);
    }

    setResponse(res);
  }
};

const BotDetectField = () => (
  <div style={{ position: "absolute", left: "-5000px" }} aria-hidden="true">
    <input
      type="text"
      name="b_af54e3644e951c32ad39be6de_10b8bb6236"
      tabIndex={-1}
      value=""
      onChange={() => undefined}
    />
  </div>
);

async function subscribe(fields: Record<FormFieldName, string>) {
  const u = new URL(SUBSCRIBE_URL);
  const keys = Object.keys(fields) as FormFieldName[];
  keys.forEach((key) => u.searchParams.set(key, fields[key]));

  if (process.env.NODE_ENV !== "production") {
    await new Promise((resolve) => {
      setTimeout(resolve, 1000);
    });
    toast.info("Showing a fake thank you");
    return {
      result: "success",
    };
  }

  const data = await fetchJsonp(u.toString(), {
    jsonpCallback: "c",
  });

  return data.json();
}
