import React from "react";
import { Icon } from "@iconify/react";
import xIcon from "@iconify/icons-teenyicons/x-circle-outline";
import exclamationIcon from "@iconify/icons-teenyicons/exclamation-circle-outline";
import tickIcon from "@iconify/icons-teenyicons/tick-circle-outline";
import infoIcon from "@iconify/icons-teenyicons/info-circle-outline";
import toast, { ToastOptions } from "react-hot-toast";

type ToastProps = {
  onClick: JSX.IntrinsicElements["div"]["onClick"];
  icon: typeof xIcon;
  iconWrapperClassName?: string;
  message: string;
  toastOptions?: ToastOptions;
  visible: boolean;
};

const Toast = ({
  icon,
  iconWrapperClassName = "",
  message,
  onClick,
  visible,
}: ToastProps) => {
  return (
    <div
      onClick={onClick}
      className={`${
        visible ? "toast-enter" : "toast-leave"
      } toast max-w-sm bg-white dark:bg-gray-9 shadow-lg dark:border dark:border-white rounded-sm pointer-events-auto flex flex-row justify-center px-3 py-1`}
    >
      <div className={iconWrapperClassName}>
        <Icon
          style={{ top: "1px" }}
          className="relative content-box text-lg"
          icon={icon}
        />
      </div>
      <div className="ml-2 flex-1">
        <p className="text-sm">{message}</p>
      </div>
    </div>
  );
};

export const error = (message: string, opts?: ToastOptions) =>
  toast.custom(
    (t) => (
      <Toast
        visible={t.visible}
        icon={xIcon}
        onClick={() => toast.dismiss(t.id)}
        message={message}
        toastOptions={opts}
        iconWrapperClassName="text-danger-4"
      />
    ),
    opts
  );

export const warning = (message: string, opts?: ToastOptions) =>
  toast.custom(
    (t) => (
      <Toast
        visible={t.visible}
        icon={exclamationIcon}
        onClick={() => toast.dismiss(t.id)}
        message={message}
        toastOptions={opts}
        iconWrapperClassName="text-warning-5"
      />
    ),
    opts
  );

export const success = (message: string, opts?: ToastOptions) =>
  toast.custom(
    (t) => (
      <Toast
        visible={t.visible}
        icon={tickIcon}
        onClick={() => toast.dismiss(t.id)}
        message={message}
        toastOptions={opts}
        iconWrapperClassName="text-success-5"
      />
    ),
    opts
  );

export const info = (message: string, opts?: ToastOptions) =>
  toast.custom(
    (t) => (
      <Toast
        visible={t.visible}
        icon={infoIcon}
        onClick={() => toast.dismiss(t.id)}
        message={message}
        toastOptions={opts}
      />
    ),
    opts
  );
